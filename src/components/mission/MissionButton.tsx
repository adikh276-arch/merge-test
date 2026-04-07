import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/mission/utils";

interface MissionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline";
}

const MissionButton = forwardRef<HTMLButtonElement, MissionButtonProps>(
  ({ className, variant = "primary", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "w-full h-[54px] rounded-[30px] text-[16px] font-medium font-body transition-colors duration-200 mx-auto",
          variant === "primary" &&
            "bg-primary text-primary-foreground shadow-md active:bg-primary-pressed",
          variant === "outline" &&
            "bg-transparent border-2 border-primary text-primary active:bg-primary/10",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

MissionButton.displayName = "MissionButton";
export default MissionButton;
