import logger from '@Utils/logger';

export function getISTRange(date: string) {
  try {
    const start = new Date(`${date}T00:00:00.000+05:30`);
    const end = new Date(`${date}T23:59:59.999+05:30`);

    return {
      startUTC: start.toISOString(),
      endUTC: end.toISOString(),
    };
  } catch (error) {
    logger.error('@getUTC conversion of date to iso', error);
    return null;
  }
}

export const convertToIsoString = (date: string) => {
  const iso = new Date(date);
  iso.setHours(0, 0, 0, 0);

  const utcInIso = iso.toISOString().replace('Z', '+00:00');
  return utcInIso;
};

export const convertToUTC = (date: string) => {
  const iso = new Date(date);

  iso.setHours(0, 0, 0, 0);

  const utcInIso = iso.toISOString().replace('Z', '+00:00');

  const utc = new Date(utcInIso);
  utc.setUTCHours(0, 0, 0, 0);

  //dateQuery
  const result = utc;
  return result.setUTCDate(result.getUTCDate() + 1);
};
