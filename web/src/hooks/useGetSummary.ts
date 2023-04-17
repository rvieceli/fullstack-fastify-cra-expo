import { useQuery } from "@tanstack/react-query";
import { getSummary } from "../lib/api";

export function useGetSummary() {
  return useQuery(["summary"], getSummary);
}
