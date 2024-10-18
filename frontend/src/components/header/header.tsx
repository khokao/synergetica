"use client";

import { NavItem } from "@/components/header/nav-item";
import { BookMarked, CircuitBoard } from "lucide-react";

export const Header = () => {
  return (
    <header className="flex items-center justify-center py-4 h-16 bg-gray-100">
      <nav className="flex space-x-6">
        <NavItem href="/studio" icon={CircuitBoard} label="Studio" />
        <NavItem href="/project" icon={BookMarked} label="Project" />
      </nav>
    </header>
  );
};
