'use client';

import { cn } from "@/lib/utils";
import { useMotionValue, motion, useMotionTemplate } from "framer-motion";
import React from "react";

export const BackgroundBeams = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function onMouseMove({
    currentTarget,
    clientX,
    clientY,
  }: React.MouseEvent<HTMLDivElement>) {
    if (!currentTarget) return;
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }
  const maskImage = useMotionTemplate`radial-gradient(350px circle at ${mouseX}px ${mouseY}px, white, transparent)`;
  const style = { maskImage, WebkitMaskImage: maskImage };

  return (
    <div
      className={cn(
        "relative h-[50vh] w-full rounded-lg border border-white/[0.2] bg-black p-20",
        className
      )}
      onMouseMove={onMouseMove}
    >
      <div className="pointer-events-none absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20" />
      <svg
        className="absolute inset-0 h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="background-pattern"
            x="0"
            y="0"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
            patternTransform="translate(-40 0)"
          >
            <rect x="0" y="0" width="40" height="40" fill="transparent" />
            <path
              d="M 40 0 L 0 0 L 0 40"
              fill="none"
              stroke="white"
              strokeWidth="1"
              opacity="0.5"
            />
          </pattern>
        </defs>
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="url(#background-pattern)"
        />
      </svg>
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-lg bg-black/20"
        style={style}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};
