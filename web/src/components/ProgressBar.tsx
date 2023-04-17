import * as Progress from "@radix-ui/react-progress";

interface ProgressBarProps {
  max?: number;
  value?: number;
}

export function ProgressBar({ max = 0, value = 0 }: ProgressBarProps) {
  const progressWidth = max ? (value / max) * 100 : 0;

  return (
    <Progress.Root
      max={max}
      value={value}
      className="h-3 mt-4 rounded-xl bg-zinc-700 w-full overflow-hidden"
    >
      <Progress.Indicator
        className="h-3 rounded-xl bg-violet-600"
        style={{
          transform: `translateX(-${100 - progressWidth}%)`,
          transition: `transform 660ms cubic-bezier(0.65, 0, 0.35, 1)`,
        }}
      />
    </Progress.Root>
  );
}
