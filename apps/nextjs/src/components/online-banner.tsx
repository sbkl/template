"use client";

import * as React from "react";
import { onlineManager } from "@tanstack/react-query";

import { Icon } from "@template/ui/components/icon";
import { cn } from "@template/ui/lib/utils";

interface OnlineBannerProps {
  children: React.ReactNode;
  className: string;
}

export function OnlineBanner({ children, className }: OnlineBannerProps) {
  const [isOnline, setIsOnline] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = onlineManager.subscribe(() => {
      setIsOnline(onlineManager.isOnline());
    });

    return () => {
      unsubscribe();
    };
  }, [onlineManager]);

  if (isOnline) {
    return children;
  }

  return (
    <>
      <div className={cn("", className)}>
        <div className="space-y-2 rounded-md border border-rose-500 bg-rose-50 px-6 py-4 text-lg text-rose-500">
          <Icon name="ExclamationTriangleIcon" className="mx-auto h-12 w-12" />
          <div className="select-none font-medium">
            You are currently offline!
          </div>
        </div>
      </div>
      {children}
    </>
  );
}
