"use client";

import { useEffect } from "react";

type KeyHandler = (e: KeyboardEvent) => void;

export function useHotkeys(keys: string, callback: KeyHandler) {
  useEffect(() => {
    const keyCombos = keys.toLowerCase().split(",").map(k => k.trim());
    
    const handler = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const meta = e.metaKey || e.ctrlKey;
      
      for (const combo of keyCombos) {
        const parts = combo.split("+").map(p => p.trim());
        if (
          (parts.includes("meta") && meta) &&
          parts.includes(key)
        ) {
          callback(e);
          return;
        }
      }
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [keys, callback]);
} 