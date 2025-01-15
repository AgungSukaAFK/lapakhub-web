export default function Modal({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[5] top-0 left-0 w-full h-screen bg-black bg-opacity-50 flex items-center justify-center">
      {children}
    </div>
  );
}
