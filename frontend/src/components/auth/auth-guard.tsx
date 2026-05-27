"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

import { useAuthStore } from "@/store/auth.store";

interface Props {
  children: React.ReactNode;
}

export function AuthGuard({
  children,
}: Props) {
  const router = useRouter();

  const user = useAuthStore(
    (state) => state.user,
  );

  const token = useAuthStore(
    (state) => state.token,
  );

  useEffect(() => {
    if (!user || !token) {
      router.push("/login");
    }
  }, [user, token, router]);

  if (!user || !token) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white text-xl">
        Проверка авторизации...
      </div>
    );
  }

  return <>{children}</>;
}