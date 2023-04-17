import { DayGraph } from "./DayGraph";
import { eachDayOfInterval, startOfYear, format } from "date-fns";
import { useGetSummary } from "../hooks/useGetSummary";
const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const today = new Date();

const days = eachDayOfInterval({
  start: startOfYear(today),
  end: today,
}).map((date) => format(date, "yyyy-MM-dd"));

const MINIMUM_INITIAL_DAYS = 18 * 7;
const dummyDays = MINIMUM_INITIAL_DAYS - days.length;

export function CalendarGraph() {
  const { isLoading, data } = useGetSummary();

  return (
    <div className="w-full flex">
      <div className="grid grid-rows-7 grid-flow-row gap-3">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-zinc-400 text-xl font-bold h-10 w-20 flex items-center justify-center"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-rows-7 grid-flow-col gap-3">
        {days.map((date) => {
          const summary = data?.summary[date];
          return (
            <DayGraph
              key={date}
              date={date}
              total={summary?.total || 0}
              completed={summary?.completed || 0}
              isLoading={isLoading}
            />
          );
        })}
        {dummyDays > 0 &&
          Array.from({ length: dummyDays }).map((_, index) => (
            <div
              key={index}
              className="w-10 h-10 bg-zinc-800 border-2 border-zinc-800 rounded-lg opacity-40"
            />
          ))}
      </div>
    </div>
  );
}
