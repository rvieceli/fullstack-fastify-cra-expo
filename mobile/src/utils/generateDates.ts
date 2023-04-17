import {
  eachDayOfInterval,
  format,
  startOfWeek,
  subDays,
  max,
  isAfter,
  isSameDay,
  differenceInDays,
} from "date-fns";
import chunk from "lodash.chunk";

const FAR_FAR_AWAY = new Date(2022, 7, 3);

export interface DateItem {
  key: string;
  date: string | undefined;
}

function generateDummyDates(count: number) {
  return count > 0
    ? Array.from({ length: count }).map((_, index) => ({
        key: String(`dummy-${index}`),
        date: undefined,
      }))
    : [];
}

//generate dates do it reverse
//starting from today ending in somewhere in the past, default is 25 weeks
export function generateDates(
  base = new Date(),
  interval = 25 * 7
): {
  dates: DateItem[];
  isEndReached: boolean;
} {
  if (isAfter(FAR_FAR_AWAY, base)) {
    return {
      dates: [],
      isEndReached: true,
    };
  }

  const past = max([startOfWeek(subDays(base, interval)), FAR_FAR_AWAY]);

  const isEndReached = isSameDay(FAR_FAR_AWAY, past);

  const beginningDummyDays = isEndReached
    ? differenceInDays(past, startOfWeek(past))
    : 0;

  const dateInterval = eachDayOfInterval({
    start: past,
    end: base,
  })
    .reverse()
    .map((date) => ({
      key: String(date.getTime()),
      date: format(date, "yyyy-MM-dd"),
    }));

  const total_days = dateInterval.length + beginningDummyDays;
  const total_weeks = Math.ceil(total_days / 7);
  const dummyDays = total_weeks * 7 - total_days;

  const dummies = generateDummyDates(dummyDays);
  const beginningDummies = generateDummyDates(beginningDummyDays);

  const dates = [...dummies, ...dateInterval, ...beginningDummies];

  const organizedDates = chunk(dates, 7)
    .map((week) => week.reverse())
    .flat();

  return {
    dates: organizedDates,
    isEndReached,
  };
}
