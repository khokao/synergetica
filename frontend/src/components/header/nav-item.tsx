import type { LucideIcon } from "lucide-react";
import Link from "next/link";

interface NavItemProps {
  href: string;
  icon: LucideIcon;
  label: string;
}

export const NavItem = ({ href, icon: Icon, label }: NavItemProps) => {
  return (
    <Link href={href} className="flex items-center space-x-2 text-gray-600 hover:text-gray-800">
      <Icon className="w-5 h-5" />
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
};
