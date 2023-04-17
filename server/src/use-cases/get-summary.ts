import { database, Prisma } from "../lib/database";
import { getDateOnly } from "../utils/date";

interface Summary {
  id: string;
  date: Date;
  completed: number;
  total: number;
}

export async function getSummary() {
  const summary = await database.$queryRaw<Summary[]>`
    select
      days_group.id,
      days_group.date,
      coalesce(days_habits_group.count, 0.0) as completed,
      coalesce(days_group.total_count, 0.0) as total

    from (
      select
        days.id,
        days.date,
        cast(count(1) as float) as total_count
      from days
      
      inner join habits
        on habits.id = habit_recurrences.habit_id
        and habits.created_at < days.date + 86400000
      
      inner join habit_recurrences
       on habit_recurrences.day_of_week = cast(strftime('%w', days.date/ 1000.0, 'unixepoch') as int)

      group by days.id, days.date 
    ) as days_group

    left join (
      select
        day_id,
        cast(count(1) as float) as count
      from days_habits 

      group by day_id
    ) as days_habits_group 
      on days_habits_group.day_id = days_group.id
  `;

  return {
    summary: summary.map(({ date, ...day }) => ({
      ...day,
      date: getDateOnly(date),
    })),
  };
}
