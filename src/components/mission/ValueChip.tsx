import { cn } from "@/lib/mission/utils";

interface ValueChipProps {
  label: string;
  selected: boolean;
  onToggle: () => void;
}

const ValueChip = ({ label, selected, onToggle }: ValueChipProps) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "px-5 py-3 rounded-full text-[15px] font-body transition-all duration-200 border",
        selected
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-transparent text-muted-foreground border-border hover:border-primary/50"
      )}
    >
      {label}
    </button>
  );
};

export default ValueChip;
