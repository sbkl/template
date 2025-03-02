"use client";

import * as RadixIcons from "@radix-ui/react-icons";
import { type IconProps } from "@radix-ui/react-icons/dist/types";

export type IconName = keyof typeof RadixIcons;

const iconMap: Record<IconName, React.ComponentType<IconProps>> = RadixIcons;

export function Icon({ name, ...props }: { name: IconName } & IconProps) {
  const IconComponent = iconMap[name];
  return IconComponent ? <IconComponent {...props} /> : null;
}
