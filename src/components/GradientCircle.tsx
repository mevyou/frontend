"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface GradientCircleProps {
  /** Size of the circle in pixels */
  size?: number;
  /** Gradient colors - array of colors for the gradient */
  gradientColors?: readonly string[];
  /** Content to display inside the circle (icon, text, etc.) */
  children?: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Custom gradient direction */
  gradientDirection?: string;
  /** Whether to show a border */
  showBorder?: boolean;
  /** Border color */
  borderColor?: string;
}

export function GradientCircle({
  size = 48,
  gradientColors = ["#FF6B6B", "#4ECDC4"],
  children,
  className,
  gradientDirection = "135deg",
  showBorder = false,
  borderColor = "rgba(255, 255, 255, 0.2)",
}: GradientCircleProps) {
  const gradientStyle = {
    background: `linear-gradient(${gradientDirection}, ${gradientColors.join(", ")})`,
    width: `${size}px`,
    height: `${size}px`,
    border: showBorder ? `1px solid ${borderColor}` : "none",
  };

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center flex-shrink-0",
        className
      )}
      style={gradientStyle}
    >
      {children}
    </div>
  );
}

// Predefined gradient combinations for common use cases
export const GradientPresets = {
  // Pink to Purple (like in the Figma designs)
  pinkPurple: ["#FF6B9D", "#C44CF1"],
  // Blue to Cyan
  blueCyan: ["#4F46E5", "#06B6D4"],
  // Green to Blue
  greenBlue: ["#10B981", "#3B82F6"],
  // Orange to Red
  orangeRed: ["#F59E0B", "#EF4444"],
  // Purple to Pink
  purplePink: ["#8B5CF6", "#EC4899"],
  // Teal to Green
  tealGreen: ["#14B8A6", "#22C55E"],
} as const;

// Helper component with preset gradients
interface PresetGradientCircleProps extends Omit<GradientCircleProps, "gradientColors"> {
  preset: keyof typeof GradientPresets;
}

export function PresetGradientCircle({
  preset,
  ...props
}: PresetGradientCircleProps) {
  return (
    <GradientCircle
      gradientColors={GradientPresets[preset]}
      {...props}
    />
  );
}