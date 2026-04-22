import Image from "next/image";
import { cn } from "@/lib/utils";

type ChonkLogoProps = {
  /** `dark` = black wordmark on light/pink backgrounds.
   *  `light` = white wordmark on dark backgrounds. */
  variant?: "dark" | "light";
  size?: "sm" | "md" | "lg";
  className?: string;
};

const dims = {
  sm: { w: 96, h: 36 },
  md: { w: 140, h: 52 },
  lg: { w: 240, h: 90 },
};

export default function ChonkLogo({
  variant = "dark",
  size = "md",
  className,
}: ChonkLogoProps) {
  const src =
    variant === "light" ? "/images/logo-white.png" : "/images/logo-pink.png";
  const { w, h } = dims[size];

  return (
    <Image
      src={src}
      alt="Chonk"
      width={w}
      height={h}
      priority={size === "md" || size === "lg"}
      className={cn("inline-block select-none h-auto", className)}
    />
  );
}
