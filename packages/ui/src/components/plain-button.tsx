import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "../lib/utils";

export interface PlainButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

const PlainButton = React.forwardRef<HTMLButtonElement, PlainButtonProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(className)} ref={ref} {...props} />;
  },
);
PlainButton.displayName = "PlainButton";

export { PlainButton };
