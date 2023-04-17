import axios, { AxiosResponse } from "axios";

export const api = axios.create({
  baseURL: "http://192.168.1.196:3000",
});

export interface Summary {
  id: string;
  date: string;
  completed: number;
  total: number;
}

export interface GetSummaryResponse {
  summary: Summary[];
}

export interface GetSummary {
  summary: Record<string, Summary>;
}

export async function getSummary() {
  const { data } = await api.get<unknown, AxiosResponse<GetSummaryResponse>>(
    "/summary"
  );

  await new Promise((resolve) => setTimeout(resolve, 1000));

  const summary: Record<string, Summary> = {};

  data.summary.forEach((day) => {
    summary[day.date] = day;
  });

  return { summary } satisfies GetSummary;
}

interface CreateHabitData {
  title: string;
  recurrence: number[];
}

interface CreateHabit {
  id: string;
  title: string;
  created_at: string;
}

export async function createHabit(data: CreateHabitData) {
  const response = await api.post<CreateHabitData, AxiosResponse<CreateHabit>>(
    "/habits",
    data
  );

  return response.data;
}

export interface GetDay {
  habits: Array<{
    id: string;
    title: string;
    created_at: string;
    completed: boolean;
  }>;
  day: {
    id: string;
    date: string;
  };
}

export async function getDay(date: string) {
  const response = await api.get<GetDay>("/day", {
    params: {
      date,
    },
  });

  return response.data;
}

interface ToggleHabitCompleteData {
  habitId: string;
  date: string;
}

interface ToggleHabitComplete {
  id: string;
  title: string;
  created_at: string;
  completed: boolean;
  day: {
    id: string;
    date: string;
  };
}

export async function toggleHabitCompletion({
  date,
  habitId,
}: ToggleHabitCompleteData) {
  const response = await api.patch<ToggleHabitComplete>(
    `/habits/${habitId}/toggle`,
    undefined,
    {
      params: {
        date,
      },
    }
  );

  return response.data;
}
