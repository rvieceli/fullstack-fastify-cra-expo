import { useQuery } from "@tanstack/react-query";
import { getDay } from "../lib/api";

export function useGetDay(date: string) {
  return useQuery(["day", date], () => getDay(date));
}
