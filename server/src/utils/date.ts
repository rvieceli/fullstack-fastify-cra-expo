export function startOfDayUTC(date: string | number | Date) {
  const utcDate = new Date(date);
  utcDate.setUTCHours(0, 0, 0, 0);
  return utcDate;
}


export function getDateOnly(date: Date) {
  return date.toISOString().substring(0, 10);
}