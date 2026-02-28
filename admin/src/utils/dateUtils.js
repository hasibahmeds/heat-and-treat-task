export const formatBDTime = (dateValue, short = false) => {
  if (!dateValue) return "—";

  const date = new Date(dateValue);

  if (isNaN(date.getTime())) return "Invalid date";

  const options = {
    timeZone: "Asia/Dhaka",
    year: short ? undefined : "numeric",
    month: short ? "numeric" : "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };

  if (short) {
    delete options.year;
    delete options.hour;
    delete options.minute;
    delete options.hour12;
  }

  return new Intl.DateTimeFormat("en-US", options).format(date);
};