import { TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/mission/utils";

const ReflectionInput = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }
>(({ className, label, ...props }, ref) => {
  return (
    <div className="space-y-3">
      <label className="block text-[15px] font-body text-foreground leading-relaxed text-center">
        {label}
      </label>
      <textarea
        ref={ref}
        className={cn(
          "w-full bg-card text-foreground text-[16px] font-body rounded-2xl border border-border",
          "px-5 py-4 min-h-[56px] resize-none placeholder:text-placeholder",
          "focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary",
          "transition-all duration-200",
          className
        )}
        rows={2}
        {...props}
      />
    </div>
  );
});

ReflectionInput.displayName = "ReflectionInput";
export default ReflectionInput;
