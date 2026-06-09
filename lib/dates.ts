function getNextWeekend(): { saturday: Date; sunday: Date } {
  const now = new Date();
  const day = now.getDay();
  const daysUntilSaturday = day === 6 ? 0 : day === 0 ? 6 : 6 - day;

  const saturday = new Date(now);
  saturday.setDate(now.getDate() + daysUntilSaturday);
  saturday.setHours(0, 0, 0, 0);

  const sunday = new Date(saturday);
  sunday.setDate(saturday.getDate() + 1);

  return { saturday, sunday };
}

function formatSpokenDate(date: Date): string {
  const weekday = date.toLocaleDateString("en-US", { weekday: "long" });
  const month = date.toLocaleDateString("en-US", { month: "long" });
  const day = date.getDate();
  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
          ? "rd"
          : "th";
  return `${weekday}, ${month} ${day}${suffix}`;
}

export function getSaleDates(): {
  saleSaturdayDate: string;
  saleSundayDate: string;
  saturdayISO: string;
  sundayISO: string;
} {
  const { saturday, sunday } = getNextWeekend();
  return {
    saleSaturdayDate: formatSpokenDate(saturday),
    saleSundayDate: formatSpokenDate(sunday),
    saturdayISO: saturday.toISOString().split("T")[0],
    sundayISO: sunday.toISOString().split("T")[0],
  };
}
