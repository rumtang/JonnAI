export default function GraphLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-screen h-screen overflow-hidden bg-[#050510] relative">
      {children}
    </div>
  );
}
