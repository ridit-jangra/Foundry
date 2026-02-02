"use client";

import { redirect_if_needed } from "@/lib/check";
import { useEffect } from "react";

export default function Page() {
  useEffect(() => {
    redirect_if_needed();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="font-mono text-4xl">Loading...</p>
    </div>
  );
}
