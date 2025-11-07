"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { MyListProvider } from "@/context/MyListContext";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const userId = session?.user?.id ?? null;

  const [profileId, setProfileId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("activeProfile");
      if (stored) {
        const p = JSON.parse(stored);
        if (p?.name) setProfileId(p.name);
      } else {
        setProfileId("guest");
      }
    } catch {
      setProfileId("guest");
    }

    setReady(true);
  }, []);

  if (!ready) return null;

  return (
    <MyListProvider>
      {children}
    </MyListProvider>
  );
}
