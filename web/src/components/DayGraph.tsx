import * as Popover from "@radix-ui/react-popover";

import classNames from "classnames";
import { DayDetail } from "./DayDetail";
import { memo } from "react";
import { X } from "phosphor-react";

interface DayGraphProps {
  date: string;
  total?: number;
  completed?: number;
  isLoading?: boolean;
}

function between(x: number, min: number, max: number) {
  return x > min && x <= max;
}

function DayGraphComponent({
  date,
  total = 0,
  completed = 0,
  isLoading = false,
}: DayGraphProps) {
  const progress = total ? (completed / total) * 100 : 0;

  return (
    <Popover.Root>
      <Popover.Trigger
        className={classNames(
          "w-10 h-10 rounded-lg transition-colors duration-500",
          "focus:outline-none focus:ring-1 focus:ring-violet-800 focus:ring-offset-2 focus:ring-offset-background",
          {
            "bg-zinc-900 border-2 border-zinc-800": progress === 0,
            "bg-violet-900 border-violet-700": between(progress, 0, 20),
            "bg-violet-800 border-violet-600": between(progress, 20, 40),
            "bg-violet-700 border-violet-500": between(progress, 40, 60),
            "bg-violet-600 border-violet-500": between(progress, 60, 80),
            "bg-violet-500 border-violet-400": between(progress, 80, 100),
          }
        )}
        style={
          isLoading
            ? {
                animation: `pulse ${Math.max(
                  1,
                  Math.random() * 5
                )}s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
              }
            : {}
        }
      />

      <Popover.Portal>
        <Popover.Content className="min-w-[320px] p-6 rounded-2xl bg-zinc-900 flex flex-col">
          <DayDetail date={date} completed={completed} total={total} />

          <Popover.Close className="absolute right-6 top-6 text-zinc-400 hover:text-zinc-200 rounded-lg focus:ring-1 focus:ring-violet-800 focus:ring-offset-2 focus:ring-offset-background">
            <X size={24} aria-label="Close" />
          </Popover.Close>
          <Popover.Arrow height={8} width={16} className="fill-zinc-900" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

export const DayGraph = memo(DayGraphComponent);
