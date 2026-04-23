import Image from "next/image";
import { cn } from "@/lib/utils";

type ChonkLogoProps = {
  /** `dark`        = black wordmark ("chonk") on light/pink backgrounds.
   *  `dark-splash` = black full "chonk!!" mark (with splash) on light/pink bg.
   *  `light`       = white wordmark on dark backgrounds.
   *  `pink`        = brand-pink full "chonk!!" mark on dark backgrounds. */
  variant?: "dark" | "dark-splash" | "light" | "pink";
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
    variant === "light"
      ? "/images/logo-white.png"
      : variant === "pink"
      ? "/images/logo-brand-pink.png"
      : variant === "dark-splash"
      ? "/images/logo-brand-dark.png"
      : "/images/logo-pink.png";
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
