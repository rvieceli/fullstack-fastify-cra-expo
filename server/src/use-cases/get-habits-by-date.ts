import { addDays, endOfDay, startOfDay } from "date-fns";
import { z } from "zod";
import { database } from "../lib/database";
import { startOfDayUTC } from "../utils/date";

export const getHabitsByDateQueryStringSchema = z.object({
  date: z
    .string()
    .refine((date) => !isNaN(new Date(date).getTime()), "Must be a valid date")
    .transform(startOfDayUTC),
});

export type GetHabitsByDateInput = z.infer<
  typeof getHabitsByDateQueryStringSchema
>;

export async function getHabitsByDate({ date }: GetHabitsByDateInput) {
  const day = await database.day.findFirst({
    where: {
      date,
    },
  });

  const habits = await database.habit.findMany({
    where: {
      created_at: {
        lte: endOfDay(date),
      },
      recurrences: {
        some: {
          day_of_week: date.getDay(),
        },
      },
    },
    include: {
      dayHabits: {
        where: {
          day_id: day?.id || "",
        },
        select: {
          day_id: true,
        },
      },
    },
  });

  return {
    habits: habits.map(({ dayHabits, ...habit }) => ({
      ...habit,
      completed: dayHabits.length > 0,
    })),
    day,
  };
}
