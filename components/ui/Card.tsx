import { cn } from "@/lib/utils";

type CardProps = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

export default function Card({ children, className, style }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-card bg-milk shadow-card transition-shadow duration-200 hover:shadow-card-hover",
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
}
