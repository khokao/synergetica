"use client";

import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import clsx from "clsx";

interface NavItemProps {
  href: string;
  icon: LucideIcon;
  label: string;
}

export const NavItem = ({ href, icon: Icon, label }: NavItemProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Button
      asChild
      variant="link"
      className={clsx(
        "flex items-center space-x-2",
        isActive ? "bg-white text-gray-900 shadow-md" : "text-gray-600 hover:text-gray-800"
      )}
    >
      <Link href={href} className="flex items-center space-x-2">
        <Icon className="w-5 h-5" />
        <span className="text-sm font-medium">{label}</span>
      </Link>
    </Button>
  );
};
