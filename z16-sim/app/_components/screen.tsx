"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Power } from "lucide-react";
import { memo, useEffect, useMemo, useRef, useState } from "react";

const Screen = memo(
  ({ className, memory = [] }: { className?: string; memory: string[] }) => {
    const [screenOn, setScreenOn] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imageDataRef = useRef<ImageData | null>(null);

    // Convert RGB values from the palette format to actual colors
    const palette = useMemo(() => {
      const colors = [];
      for (let i = 0; i < 16; i++) {
        const byte = parseInt(memory[0xfa00 + i] || "0", 2);
        // Extract RGB components according to the spec
        const r = Math.ceil(((byte >> 5) & 0x07) * 36.4); // 3 bits for red (0-7) -> (0-255)
        const g = Math.ceil(((byte >> 2) & 0x07) * 36.4); // 3 bits for green (0-7) -> (0-255)
        const b = (byte & 0x03) * 85; // 2 bits for blue (0-3) -> (0-255)
        colors.push({ r, g, b });
      }
      return colors;
    }, [memory.slice(0xfa00, 0xfa10).join(",")]);

    // Parse tile definitions - memoized with proper dependency
    const tileDefinitions = useMemo(() => {
      const tiles = new Array(16);

      for (let tileNum = 0; tileNum < 16; tileNum++) {
        const tileData = new Uint8Array(256); // 16x16 pixels, one byte per pixel
        const baseAddr = 0xf200 + tileNum * 128;

        // Each tile is 16x16 pixels
        for (let row = 0; row < 16; row++) {
          for (let col = 0; col < 16; col += 2) {
            // Each byte contains 2 pixels (4 bits each)
            const byteIndex = row * 8 + col / 2;
            const byte = parseInt(memory[baseAddr + byteIndex] || "0", 2);

            // First pixel is in lower 4 bits
            tileData[row * 16 + col] = byte & 0x0f;
            // Second pixel is in upper 4 bits
            tileData[row * 16 + col + 1] = (byte >> 4) & 0x0f;
          }
        }
        tiles[tileNum] = tileData;
      }
      return tiles;
    }, [memory.slice(0xf200, 0xfa00).join(",")]);

    // Get the tile map - memoized with proper dependency
    const tileMap = useMemo(() => {
      const map = new Uint8Array(300);
      for (let i = 0; i < 300; i++) {
        map[i] = parseInt(memory[0xf000 + i] || "0", 10) & 0x0f;
      }
      return map;
    }, [memory.slice(0xf000, 0xf12c).join(",")]);

    // Render the entire screen
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d", { alpha: false });
      if (!ctx) return;

      // Initialize ImageData if needed
      if (!imageDataRef.current) {
        imageDataRef.current = ctx.createImageData(320, 240);
      }

      const imageData = imageDataRef.current;
      const data = imageData.data;

      if (!screenOn) {
        // Fill with black when screen is off
        data.fill(0);
      } else {
        // Render all tiles
        let tileIndex = 0;

        for (let tileY = 0; tileY < 15; tileY++) {
          for (let tileX = 0; tileX < 20; tileX++) {
            const tileNum = tileMap[tileIndex++];
            const tileData = tileDefinitions[tileNum];

            if (!tileData) continue;

            // Calculate tile position in pixels
            const startX = tileX * 16;
            const startY = tileY * 16;

            // Copy tile pixels to the main image buffer
            for (let y = 0; y < 16; y++) {
              for (let x = 0; x < 16; x++) {
                const colorIndex = tileData[y * 16 + x];
                const color = palette[colorIndex];

                // Calculate position in the image data array
                const pixelX = startX + x;
                const pixelY = startY + y;
                const offset = (pixelY * 320 + pixelX) * 4;

                // Set RGBA values
                data[offset] = color.r;
                data[offset + 1] = color.g;
                data[offset + 2] = color.b;
                data[offset + 3] = 255; // Alpha
              }
            }
          }
        }
      }

      // Draw the entire image at once
      ctx.putImageData(imageData, 0, 0);
    }, [screenOn, palette, tileDefinitions, tileMap]);

    return (
      <div
        className={cn(
          className,
          "flex flex-col items-center justify-center p-4"
        )}
      >
        <h1 className="text-white text-2xl mb-4 font-bold">ZX16 Display</h1>

        <div className="relative bg-gray-900 p-4 rounded-lg shadow-2xl">
          <div className="bg-black rounded">
            <canvas
              ref={canvasRef}
              width={320}
              height={240}
              className="block"
              style={{
                imageRendering: "pixelated",
              }}
            />
          </div>

          <div className="absolute top-2 right-2">
            <div
              className={cn(
                "w-2 h-2 rounded-full transition-colors",
                screenOn
                  ? "bg-green-500 shadow-green-500/50 shadow-sm"
                  : "bg-red-900"
              )}
            />
          </div>
        </div>

        <div className="mt-4 flex gap-4">
          <Button
            variant="outline"
            size="lg"
            onClick={() => setScreenOn(!screenOn)}
            className={cn(
              "flex items-center gap-2 transition-all",
              screenOn
                ? "text-green-500 border-green-500"
                : "text-red-500 border-red-500"
            )}
          >
            <Power className="w-5 h-5" />
            {screenOn ? "Screen On" : "Screen Off"}
          </Button>
        </div>

        <div className="mt-4 text-xs text-gray-500 font-mono">
          <div>Resolution: 320×240 (QVGA)</div>
          <div>Tiles: 20×15 (16×16px each)</div>
          <div>Colors: 16 (RGB332 format)</div>
        </div>
      </div>
    );
  }
);

Screen.displayName = "Screen";

export default Screen;
