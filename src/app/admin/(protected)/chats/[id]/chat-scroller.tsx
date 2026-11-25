"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function ChatScroller({ children }: { children: ReactNode }) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, []);

  return (
    <div className="wa-body">
      {children}
      <div ref={endRef} />
    </div>
  );
}
