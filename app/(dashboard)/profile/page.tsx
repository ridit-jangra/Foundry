import { Suspense } from "react";
import Client from "./client";

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <Client />
    </Suspense>
  );
}
