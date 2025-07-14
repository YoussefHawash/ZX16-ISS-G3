"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { ArrowRightLeft, Calculator, Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";
export function NumberConverter() {
  const [inputValue, setInputValue] = useState("");
  const [inputBase, setInputBase] = useState("10");
  const [outputBase, setOutputBase] = useState("2");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [bitWidth, setBitWidth] = useState("8");
  const [isSigned, setIsSigned] = useState(false);

  const bases = [
    { value: "2", label: "Binary", prefix: "" },
    { value: "8", label: "Octal", prefix: "0o" },
    { value: "10", label: "Decimal", prefix: "" },
    { value: "16", label: "Hexadecimal", prefix: "0x" },
  ];

  const bitWidths = ["8", "16", "32", "64"];

  const validateInput = (value: string, base: any) => {
    if (!value) return true;

    const baseNum = parseInt(base);
    let regex;

    switch (baseNum) {
      case 2:
        regex = /^[01]+$/;
        break;
      case 8:
        regex = /^[0-7]+$/;
        break;
      case 10:
        regex = /^-?[0-9]+$/; // Allow negative for signed decimal
        break;
      case 16:
        regex = /^[0-9a-fA-F]+$/;
        break;
      default:
        return false;
    }

    return regex.test(value);
  };

  const convert = () => {
    if (!inputValue) {
      setResult("");
      setError("");
      return;
    }

    if (!validateInput(inputValue, inputBase)) {
      setError(
        `Invalid ${bases.find((b) => b.value === inputBase)?.label} number`
      );
      setResult("");
      return;
    }

    try {
      let decimal;
      const bits = parseInt(bitWidth);
      const maxUnsigned = Math.pow(2, bits) - 1;
      const maxSigned = Math.pow(2, bits - 1) - 1;
      const minSigned = -Math.pow(2, bits - 1);

      // Convert to decimal first
      if (inputBase === "10" && inputValue.startsWith("-")) {
        decimal = parseInt(inputValue, 10);
      } else {
        decimal = parseInt(inputValue, parseInt(inputBase));
      }

      if (isNaN(decimal)) {
        setError("Conversion error");
        setResult("");
        return;
      }

      // Check bounds
      if (isSigned) {
        if (decimal > maxSigned || decimal < minSigned) {
          setError(
            `Value out of range for ${bits}-bit signed (${minSigned} to ${maxSigned})`
          );
          setResult("");
          return;
        }
        // Convert negative decimal to two's complement representation
        if (decimal < 0) {
          decimal = Math.pow(2, bits) + decimal;
        }
      } else {
        if (decimal < 0) {
          setError("Unsigned values cannot be negative");
          setResult("");
          return;
        }
        if (decimal > maxUnsigned) {
          setError(
            `Value out of range for ${bits}-bit unsigned (0 to ${maxUnsigned})`
          );
          setResult("");
          return;
        }
      }

      // Convert from decimal to target base
      let converted;
      const targetBase = parseInt(outputBase);

      if (targetBase === 10) {
        if (isSigned && decimal > maxSigned) {
          // Convert two's complement back to negative decimal
          converted = (decimal - Math.pow(2, bits)).toString();
        } else {
          converted = decimal.toString();
        }
      } else {
        converted = decimal.toString(targetBase).toUpperCase();

        // Pad with zeros for binary and hex to show full bit width
        if (targetBase === 2) {
          converted = converted.padStart(bits, "0");
        } else if (targetBase === 16) {
          converted = converted.padStart(bits / 4, "0");
        }
      }

      setResult(converted);
      setError("");
    } catch (err) {
      setError("Conversion error");
      setResult("");
    }
  };

  useEffect(() => {
    convert();
  }, [inputValue, inputBase, outputBase, bitWidth, isSigned]);

  const swapBases = () => {
    setInputBase(outputBase);
    setOutputBase(inputBase);
    setInputValue(""); // Set input value to current result
  };

  const copyToClipboard = async () => {
    if (result) {
      try {
        await navigator.clipboard.writeText(result);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
  };

  const getBaseInfo = (base: any) => bases.find((b) => b.value === base);

  return (
    <Dialog>
      <DialogTrigger className="hover:cursor-pointer text-xs">
        <ArrowRightLeft />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Number System Converter</DialogTitle>
        </DialogHeader>
        <Separator />
        <div className="w-full max-w-2xl mx-auto ">
          {/* Settings Row */}
          <div className="flex gap-4 mb-6">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium ">Bit Width:</label>
              <select
                value={bitWidth}
                onChange={(e) => setBitWidth(e.target.value)}
                className="px-3 py-1 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {bitWidths.map((width) => (
                  <option key={width} value={width} className="bg-neutral-800">
                    {width}-bit
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="signed"
                checked={isSigned}
                onChange={(e) => setIsSigned(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="signed" className="text-sm font-medium ">
                Signed (Two's Complement)
              </label>
            </div>
          </div>

          <div className="space-y-6">
            {/* Input Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium ">From:</label>
                <select
                  value={inputBase}
                  onChange={(e) => setInputBase(e.target.value)}
                  className="px-3 py-1 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {bases.map((base) => (
                    <option
                      key={base.value}
                      value={base.value}
                      className="bg-neutral-800"
                    >
                      {base.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value.trim())}
                  placeholder={`Enter ${getBaseInfo(inputBase)?.label} number`}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    error ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {getBaseInfo(inputBase)?.prefix &&
                  inputValue &&
                  !inputValue.startsWith("-") && (
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                      {getBaseInfo(inputBase)?.prefix}
                    </span>
                  )}
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>

            {/* Swap Button */}
            <div className="flex justify-center">
              <button
                onClick={swapBases}
                className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ArrowRightLeft className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Output Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium ">To:</label>
                <select
                  value={outputBase}
                  onChange={(e) => setOutputBase(e.target.value)}
                  className="px-3 py-1 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {bases.map((base) => (
                    <option
                      key={base.value}
                      value={base.value}
                      className="bg-neutral-800"
                    >
                      {base.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <div className="w-full px-4 py-3 border border-gray-300 rounded-lg  min-h-[48px] flex items-center">
                  {result ? (
                    <>
                      <span className="text-gray-500 text-sm mr-1">
                        {getBaseInfo(outputBase)?.prefix}
                      </span>
                      <span className="font-mono text-lg">{result}</span>
                    </>
                  ) : (
                    <span className="text-gray-400">
                      Result will appear here
                    </span>
                  )}
                </div>

                {result && (
                  <button
                    onClick={copyToClipboard}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2  rounded transition-colors"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-600" />
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Value Range Info */}
            {result && (
              <div className="mt-4 p-3  rounded-lg text-sm">
                <div className="text-gray-600">
                  {isSigned ? (
                    <span>
                      {bitWidth}-bit signed range:{" "}
                      {-Math.pow(2, parseInt(bitWidth) - 1)} to{" "}
                      {Math.pow(2, parseInt(bitWidth) - 1) - 1}
                    </span>
                  ) : (
                    <span>
                      {bitWidth}-bit unsigned range: 0 to{" "}
                      {Math.pow(2, parseInt(bitWidth)) - 1}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
