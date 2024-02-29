const hourInMs = 1000 * 60 * 60;
const dayInMs = hourInMs * 24;

const convertWithRemainder = (unitInMs: number) => (ms: number) => {
  const converted = ms / unitInMs;
  const remainder = ms % unitInMs;
  return [converted | 0, remainder] as const;
};

const msToDays = convertWithRemainder(dayInMs);

const msToHours = convertWithRemainder(hourInMs);

const msToMinutes = convertWithRemainder(1000 * 60);

export function tsToHoursDays(tsInMs: number) {
  const [days, remainderFromDays] = msToDays(tsInMs);
  const [hours, remainderFromHours] = msToHours(remainderFromDays);
  const [minutes, remainderFromMinutes] = msToMinutes(remainderFromHours);
  const seconds = (remainderFromMinutes / 1000) | 0;
  return {
    hours: hours,
    days: days,
    minutes: minutes,
    seconds: seconds,
  };
}
