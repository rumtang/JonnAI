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
