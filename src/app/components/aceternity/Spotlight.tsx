'use client';

import { cn } from "@/lib/utils";
import { useMotionValue, motion, useMotionTemplate } from "framer-motion";
import React from "react";

export const Spotlight = ({
  children,
  className,
  spotlightColor = "white",
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
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
  const maskImage = useMotionTemplate`radial-gradient(650px circle at ${mouseX}px ${mouseY}px, ${spotlightColor}, transparent 40%)`;
  const style = { maskImage, WebkitMaskImage: maskImage };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-white/[0.2] bg-black",
        className
      )}
      onMouseMove={onMouseMove}
      {...props}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20" />
      <motion.div
        className="pointer-events-none absolute inset-0 bg-black"
        style={style}
      />
      <div className="relative">{children}</div>
    </div>
  );
};
