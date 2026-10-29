"use client";
import { useEffect } from "react";
import { getUser, onAuthChange } from "@netlify/identity";

export function SessionGuard({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const check = async () => {
      if (document.visibilityState === "hidden") return;
      if (!(await getUser())) window.location.replace("/login");
    };
    void check();
    const unsubscribe = onAuthChange(event => {
      if (event === "logout") window.location.replace("/login");
    });
    document.addEventListener("visibilitychange", check);
    return () => { unsubscribe(); document.removeEventListener("visibilitychange", check); };
  }, []);
  return children;
}
