import { database } from "../lib/database";
import { z } from "zod";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { startOfDayUTC } from "../utils/date";

export const toggleHabitCompleteParamsSchema = z.object({
  id: z.string().uuid(),
});

export const toggleHabitCompleteQueryStringSchema = z.object({
  date: z
    .string()
    .refine(
      (date) => !date || !isNaN(new Date(date).getTime()),
      "Must be a valid date"
    )
    .transform(startOfDayUTC),
});

export async function toggleHabitComplete(
  params: z.infer<typeof toggleHabitCompleteParamsSchema>,
  queryString: z.infer<typeof toggleHabitCompleteQueryStringSchema>
) {
  const { id } = params;
  const { date } = queryString;

  const habit = await database.habit.findFirstOrThrow({
    where: { id },
  });

  let day = await database.day.findFirst({
    where: {
      date,
    },
  });

  if (!day) {
    day = await database.day.create({
      data: {
        date,
      },
    });
  }

  try {
    await database.dayHabit.create({
      data: {
        day_id: day.id,
        habit_id: id,
      },
    });

    return {
      ...habit,
      completed: true,
      day,
    };
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError && e.code === "P2002") {
      await database.dayHabit.delete({
        where: {
          day_id_habit_id: {
            day_id: day.id,
            habit_id: id,
          },
        },
      });

      return {
        ...habit,
        completed: false,
        day,
      };
    } else {
      throw e;
    }
  }
}
