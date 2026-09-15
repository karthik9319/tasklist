export function toDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function todayString(): string {
  return toDateString(new Date());
}

export function addDays(date: Date, days: number): Date {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

export function formatTime12h(time: string): string {
  const [hourStr, minuteStr] = time.split(":");
  const hour = Number(hourStr);
  const minute = Number(minuteStr);
  const period = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${String(minute).padStart(2, "0")} ${period}`;
}

export function formatDueLabel(dueDate: string, dueTime?: string | null): string {
  const today = todayString();
  const tomorrow = toDateString(addDays(new Date(), 1));

  let dayLabel: string;
  if (dueDate === today) {
    dayLabel = "Today";
  } else if (dueDate === tomorrow) {
    dayLabel = "Tomorrow";
  } else {
    const [y, m, d] = dueDate.split("-").map(Number);
    dayLabel = new Date(y, m - 1, d).toLocaleDateString(undefined, {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  }

  return dueTime ? `${dayLabel}, ${formatTime12h(dueTime)}` : dayLabel;
}
