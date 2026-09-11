"use client";

import { useEffect } from "react";
import { clearPassToken } from "@/lib/passStore";

// Silently clears the stored pass token when visiting /register
// so the nav resets to show "Register" instead of "My Pass"
export default function ClearPass() {
  useEffect(() => {
    clearPassToken();
  }, []);
  return null;
}
