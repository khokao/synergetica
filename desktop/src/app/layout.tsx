import "tailwindcss/tailwind.css";
import "@xyflow/react/dist/style.css";
import "../styles/globals.css";
import { Header } from "@/components/header/header";
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex flex-col h-screen w-screen">
        <Header />
        <main className="flex-grow min-h-0">{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
