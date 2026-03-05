const NAIROBI_TZ = "Africa/Nairobi";

const hasExplicitTimezone = (value: string) => /(?:[zZ]|[+-]\d{2}:\d{2})$/.test(value);

export const parseApiDate = (value?: string | null) => {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  const normalized = hasExplicitTimezone(trimmed) ? trimmed : `${trimmed}Z`;
  const parsed = new Date(normalized);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const formatNairobiDateTime = (value?: string | null) => {
  const date = parseApiDate(value);
  if (!date) return "N/A";
  return new Intl.DateTimeFormat("en-KE", {
    timeZone: NAIROBI_TZ,
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
};

export const nowInNairobiDateTime = () =>
  new Intl.DateTimeFormat("en-KE", {
    timeZone: NAIROBI_TZ,
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date());

export const nowInNairobiTime = () =>
  new Intl.DateTimeFormat("en-KE", {
    timeZone: NAIROBI_TZ,
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());

export const nowInNairobiDate = () =>
  new Intl.DateTimeFormat("en-KE", {
    timeZone: NAIROBI_TZ,
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(new Date());

export const formatDateObjectNairobi = (value: Date) =>
  new Intl.DateTimeFormat("en-KE", {
    timeZone: NAIROBI_TZ,
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(value);
