export const getLastDay = (periodOfTime) => {
  if (!Number.isInteger(periodOfTime)) {
    return;
  }
  const fromTime = new Date();
  const time: Date = new Date(fromTime.getTime() - periodOfTime * 1000 * 60 * 60 * 24);

  return time;
};
