"use client";
import Image from "next/image";
import React, { useState } from "react";
import {
  motion,
  useTransform,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { cn } from "@/lib/utils";

export const AnimatedTooltip = ({
  items,
  className,
}: {
  items: {
    id: number;
    name: string;
    designation: string;
    image: string;
  }[];
  className?: string;
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const springConfig = { stiffness: 100, damping: 5 };
  const x = useMotionValue(0);
  const rotate = useSpring(
    useTransform(x, [-100, 100], [-45, 45]),
    springConfig
  );
  const translateX = useSpring(
    useTransform(x, [-100, 100], [-50, 50]),
    springConfig
  );
  const handleMouseMove = (event: React.MouseEvent<HTMLImageElement>) => {
    const halfWidth = (event.target as HTMLImageElement).offsetWidth / 2;
    x.set(event.nativeEvent.offsetX - halfWidth);
  };

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-center gap-4 sm:gap-2",
        className
      )}
    >
      {items.map((item) => (
        <div
          className="relative group -mr-2 sm:-mr-4"
          key={item.name}
          onMouseEnter={() => setHoveredIndex(item.id)}
          onMouseLeave={() => setHoveredIndex(null)}
          onTouchStart={() => setHoveredIndex(item.id)} // For touch devices
          onTouchEnd={() => setHoveredIndex(null)}
        >
          <AnimatePresence mode="popLayout">
            {hoveredIndex === item.id && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.6 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: {
                    type: "spring",
                    stiffness: 260,
                    damping: 10,
                  },
                }}
                exit={{ opacity: 0, y: 20, scale: 0.6 }}
                style={{
                  translateX: translateX,
                  rotate: rotate,
                  whiteSpace: "nowrap",
                }}
                className="absolute -top-16 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center justify-center rounded-md bg-foreground shadow-xl px-2 py-1 sm:px-4 sm:py-2 w-max max-w-[90vw] sm:max-w-xs"
              >
                <div className="absolute inset-x-10 -bottom-px h-px w-[20%] bg-gradient-to-r from-transparent via-emerald-500 to-transparent z-30" />
                <div className="absolute left-10 -bottom-px h-px w-[40%] bg-gradient-to-r from-transparent via-sky-500 to-transparent z-30" />
                <div className="font-bold text-background text-sm sm:text-base relative z-30">
                  {item.name}
                </div>
                <div className="text-muted-foreground text-xs sm:text-xs">
                  {item.designation}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <Image
            onMouseMove={handleMouseMove}
            height={100}
            width={100}
            src={item.image}
            alt={item.name}
            className={cn(
              "object-cover !m-0 !p-0 object-top rounded-full h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 lg:h-28 lg:w-28 border-2 group-hover:scale-105 group-hover:z-30 border-background relative transition duration-500"
            )}
          />
        </div>
      ))}
    </div>
  );
};
