import { z } from "zod";
import { database } from "../lib/database";

export const createHabitBodySchema = z.object({
  title: z.string().trim().min(1).max(255),
  recurrence: z.array(z.number().int().min(0).max(6)).min(1),
});

export type CreateHabitInput = z.input<typeof createHabitBodySchema>;

export function createHabit({ title, recurrence }: CreateHabitInput) {
  const habit = database.habit.create({
    data: {
      title: title,
      recurrences: {
        create: recurrence.map((day) => ({ day_of_week: day })),
      },
    },
  });

  return habit;
}
