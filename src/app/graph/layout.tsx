import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Graph Explorer — Agentic",
};

export default function GraphLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-screen h-screen overflow-hidden relative">
      {children}
    </div>
  );
}
