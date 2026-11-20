// Display helpers shared by server and client components. Nothing here reads the
// current time, so it's safe in pre-rendered pages; see dates.ts for that.

const gbp = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 });
const day = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

export function formatDate(value: string | null, fallback = "Not published") {
  if (!value) return fallback;
  const d = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(d.getTime()) ? fallback : day.format(d);
}

export function formatSalary(min: number | null, max?: number | null, fallback = "Not published") {
  if (min === null) return fallback;
  return max && max > min ? `${gbp.format(min)} to ${gbp.format(max)}` : gbp.format(min);
}

// "Leeds", "Leeds and Hull", "Leeds, Hull +6 more"
export function formatLocations(locations: string[], max = 2, fallback = "Not published") {
  if (locations.length === 0) return fallback;
  if (locations.length <= max) return locations.join(locations.length === 2 ? " and " : ", ");
  return `${locations.slice(0, max).join(", ")} +${locations.length - max} more`;
}

export const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;
