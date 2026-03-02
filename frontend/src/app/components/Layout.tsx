import { IndianBorder } from "./defence/IndianBorder";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="w-full min-h-screen" style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif", backgroundColor: "#ffffff" }}>
        <IndianBorder sticky />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {children}
        </div>
      </div>
      <IndianBorder flip />
    </>
  );
}
