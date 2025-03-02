"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useSpring,
} from "motion/react";

import { ButtonLink } from "@template/ui/components/button-link";
import { PlainButton } from "@template/ui/components/plain-button";
import { cn } from "@template/ui/lib/utils";

const ProgressBarContext = React.createContext<{
  progress: ReturnType<typeof useProgress>;
  onHandleProgress(
    href: string,
    config?: { method: "push" | "replace"; callback?: () => void },
  ): void;
} | null>(null);

export function useProgressBar() {
  const progress = React.useContext(ProgressBarContext);

  if (progress === null) {
    throw new Error("useProgressBar must be used within a ProgressBar");
  }

  return progress;
}

export function ProgressBar({
  className,
  children,
}: {
  className: string;
  children: React.ReactNode;
}) {
  const progress = useProgress();
  const width = useMotionTemplate`${progress.value}%`;
  const router = useRouter();

  function onHandleProgress(
    href: string,
    config: {
      callback?: () => void;
      method: "push" | "replace";
    } = {
      method: "push",
    },
  ) {
    progress.start();

    React.startTransition(() => {
      if (config.method === "push") {
        router.push(href.toString());
      } else {
        router.replace(href.toString());
      }
      progress.done();
      config.callback?.();
    });
  }

  return (
    <ProgressBarContext.Provider value={{ onHandleProgress, progress }}>
      <AnimatePresence onExitComplete={progress.reset}>
        {progress.state !== "complete" && (
          <motion.div
            style={{ width }}
            exit={{ opacity: 0 }}
            className={cn("test-progress-bar", className)}
          />
        )}
      </AnimatePresence>

      {children}
    </ProgressBarContext.Provider>
  );
}

export const PlainProgressBarLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentProps<typeof Link> & {
    disabled?: boolean;
  }
>(({ className, disabled, href, onClick, ...props }, forwardRef) => {
  const { progress } = useProgressBar();
  const router = useRouter();
  return (
    <PlainButton
      asChild
      disabled={disabled}
      className={cn(
        className,
        disabled ? "pointer-events-none cursor-not-allowed opacity-50" : "",
      )}
    >
      <Link
        {...props}
        className={cn(
          disabled ? "pointer-events-none cursor-not-allowed opacity-50" : "",
        )}
        ref={forwardRef}
        href={href}
        onClick={(e) => {
          e.preventDefault();
          if (!disabled) {
            progress.start();

            React.startTransition(() => {
              onClick?.(e);
              router.push(href.toString());
              progress.done();
            });
          }
        }}
      />
    </PlainButton>
  );
});

PlainProgressBarLink.displayName = "PlainProgressBarLink";

export const ProgressBarLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentProps<typeof Link> & {
    size?: React.ComponentProps<typeof ButtonLink>["size"];
    variant?: React.ComponentProps<typeof ButtonLink>["variant"];
    disabled?: boolean;
  }
>(
  (
    {
      className,
      disabled,
      href,
      onClick,
      size = "icon",
      variant = "ghost",
      ...props
    },
    forwardRef,
  ) => {
    const { progress } = useProgressBar();
    const router = useRouter();
    return (
      <ButtonLink
        asChild
        disabled={disabled}
        className={cn(
          className,
          disabled ? "pointer-events-none cursor-not-allowed opacity-50" : "",
        )}
        variant={variant}
        size={size as any}
      >
        <Link
          {...props}
          className={cn(
            disabled ? "pointer-events-none cursor-not-allowed opacity-50" : "",
          )}
          ref={forwardRef}
          href={href}
          onClick={(e) => {
            e.preventDefault();
            if (!disabled) {
              progress.start();

              React.startTransition(() => {
                onClick?.(e);
                router.push(href.toString());
                progress.done();
              });
            }
          }}
        />
      </ButtonLink>
    );
  },
);

ProgressBarLink.displayName = "ProgressBarLink";
function useProgress() {
  const [state, setState] = React.useState<
    "initial" | "in-progress" | "completing" | "complete"
  >("initial");

  const value = useSpring(0, {
    damping: 25,
    mass: 0.5,
    stiffness: 300,
    restDelta: 0.1,
  });

  useInterval(
    () => {
      // If we start progress but the bar is currently complete, reset it first.
      if (value.get() === 100) {
        value.jump(0);
      }

      const current = value.get();

      let diff;
      if (current === 0) {
        diff = 15;
      } else if (current < 50) {
        diff = rand(1, 10);
      } else {
        diff = rand(1, 5);
      }

      value.set(Math.min(current + diff, 99));
    },
    state === "in-progress" ? 750 : null,
  );

  React.useEffect(() => {
    if (state === "initial") {
      value.jump(0);
    } else if (state === "completing") {
      value.set(100);
    }

    return value.on("change", (latest) => {
      if (latest === 100) {
        setState("complete");
      }
    });
  }, [value, state]);

  function reset() {
    setState("initial");
  }

  function start() {
    setState("in-progress");
  }

  function done() {
    setState((state) =>
      state === "initial" || state === "in-progress" ? "completing" : state,
    );
  }

  return { state, value, start, done, reset };
}

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = React.useRef(callback);

  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  React.useEffect(() => {
    function tick() {
      savedCallback.current();
    }

    if (delay !== null) {
      tick();

      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
