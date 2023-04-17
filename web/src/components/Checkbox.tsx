import { Children, ReactNode } from "react";
import { Root, Indicator, CheckboxProps } from "@radix-ui/react-checkbox";
import classNames from "classnames";
import { Check } from "phosphor-react";

type Props = { children?: ReactNode; completable?: boolean } & CheckboxProps &
  React.RefAttributes<HTMLButtonElement>;

export function Checkbox({
  children,
  className,
  completable = false,
  ...props
}: Props) {
  return (
    <Root
      className={classNames(
        "flex items-center gap-3 group focus:outline-none",
        className
      )}
      {...props}
    >
      <div
        className={classNames(
          "h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500 transition-colors",
          "group-focus:outline-none group-focus:ring-1 group-focus:ring-violet-800 group-focus:ring-offset-2 group-focus:ring-offset-background",
          "disabled:cursor-not-allowed"
        )}
      >
        <Indicator className=''>
          <Check size={20} className="text-white" />
        </Indicator>
      </div>
      <span
        className={classNames("text-white leading-tight", {
          "font-semibold text-xl group-data-[state=checked]:line-through group-data-[state=checked]:text-zinc-400":
            completable,
        })}
      >
        {children}
      </span>
    </Root>
  );
}
