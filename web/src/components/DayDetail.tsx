import { ProgressBar } from "./ProgressBar";
import { Checkbox } from "./Checkbox";
import { useGetDay } from "../hooks/useGetDay";
import { useToggleHabitCompletion } from "../hooks/useToggleHabitCompletion";

interface DayDetailProps {
  date: string;
  total?: number;
  completed?: number;
}

const weekDayFormatter = new Intl.DateTimeFormat(undefined, {
  weekday: "long",
}).format;

const monthDayFormatter = new Intl.DateTimeFormat(undefined, {
  month: "long",
  day: "numeric",
}).format;

export function DayDetail({ date, total = 0, completed = 0 }: DayDetailProps) {
  const asDate = new Date(date);
  const weekDay = weekDayFormatter(asDate);
  const monthDay = monthDayFormatter(asDate);

  const { data } = useGetDay(date);
  const { handleToggleCompletion } = useToggleHabitCompletion(date);

  return (
    <>
      <span className="font-semibold text-zinc-400 lowercase">{weekDay}</span>
      <span className="mt-1 font-extrabold leading-tight text-3xl">
        {monthDay}
      </span>

      <ProgressBar max={total} value={completed} />

      <div className="mt-6 flex flex-col gap-3">
        {data?.habits.map((habit) => (
          <Checkbox
            key={habit.id}
            completable
            checked={habit.completed}
            onCheckedChange={() => handleToggleCompletion(habit)}
          >
            {habit.title}
          </Checkbox>
        ))}
      </div>
    </>
  );
}
