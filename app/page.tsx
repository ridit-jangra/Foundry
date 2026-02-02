"use client";

import { get_current_user } from "@/services/authService";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const user = get_current_user();

    if (!user) router.replace("/login");
    else router.replace(`/profile=${user.username}`);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="font-mono text-4xl">Loading...</p>
    </div>
  );
}
