import { differenceInCalendarDays } from "date-fns";
import type { TravelStyle } from "@prisma/client";

const styleMultiplier: Record<TravelStyle, number> = {
  BUDGET: 0.92,
  COMFORT: 1,
  LUXURY: 1.32,
};

export function computeNights(start: Date, end: Date) {
  const n = differenceInCalendarDays(end, start);
  return Math.max(1, n);
}

export function computeBaseTotal(params: {
  basePrice: number;
  startDate: Date;
  endDate: Date;
  adults: number;
  children: number;
  travelStyle: TravelStyle;
}) {
  const nights = computeNights(params.startDate, params.endDate);
  const mult = styleMultiplier[params.travelStyle];
  const travelerUnits = params.adults + params.children * 0.55;
  return (
    Math.round(params.basePrice * nights * travelerUnits * mult * 100) / 100
  );
}

export function computeAddonsTotal(
  lines: { unitPrice: number; quantity: number }[],
) {
  const sum = lines.reduce(
    (acc, l) => acc + l.unitPrice * l.quantity,
    0,
  );
  return Math.round(sum * 100) / 100;
}
