"use client";

import * as Icons from "lucide-react";
import { LucideIcon } from "lucide-react";

interface IconRendererProps {
  iconName: string;
  className?: string;
  size?: number;
}

export const IconRenderer = ({ iconName, className = "", size = 20 }: IconRendererProps) => {
  // @ts-ignore - Dynamic icon access
  const Icon = Icons[iconName as keyof typeof Icons] as LucideIcon;

  if (!Icon) {
    // Fallback to a default icon if the icon name doesn't exist
    const DefaultIcon = Icons.FileText as LucideIcon;
    return <DefaultIcon className={className} size={size} />;
  }

  return <Icon className={className} size={size} />;
};

