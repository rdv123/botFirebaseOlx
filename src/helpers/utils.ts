import { Ad, Collection } from './database.js';

export async function pause(val = 500): Promise<null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(null);
    }, val);
  });
}

export function compareCollections(
  src: Collection<Ad>,
  updates: Collection<Ad>,
): string[] {
  return Object.keys(updates).filter((key: string) => !src[key]);
}

export const getDigitsOnly = (inputString: string) =>
  Number(inputString.replace(/\D/g, ''));
