import { SERVICE_AREA_ZIPS } from '@/config/site';
import type { ServiceAreaResult } from '@/types';

export function normalizeZip(zip: string): string {
  return zip.trim().slice(0, 5);
}

export function isServiceableZip(zip: string): boolean {
  const z = zip.trim();
  return /^\d{5}$/.test(z) && z in SERVICE_AREA_ZIPS;
}

export function checkServiceArea(zip: string): ServiceAreaResult {
  const z = zip.trim();
  const serviceable = isServiceableZip(z);
  return { zip: z, serviceable, city: serviceable ? SERVICE_AREA_ZIPS[z] : null };
}
