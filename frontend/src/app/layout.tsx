import "tailwindcss/tailwind.css";
import "@xyflow/react/dist/style.css";
import "../styles/globals.css";
import { Toaster } from "@/components/ui/sonner"
import { Header } from "@/components/header/header";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex flex-col h-screen w-screen">
        <Header />
        <main className="flex-grow">{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
