"use client";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";

export default function Report() {
  return (
    <Button
      variant="outline"
      size="sm"
      color="primary"
      style={{ zIndex: 1000 }}
      className="absolute bottom-4 right-4"
      onClick={() => {
        window.location.href =
          "https://github.com/YoussefHawash/ZX16-ISS-G3/issues";
      }}
    >
      <Info />
      Report a Bug
    </Button>
  );
}
