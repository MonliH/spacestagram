import { isSameDay } from "date-fns";
import { Range } from "react-date-range";

export function sameRangeDays(range1: Range, range2: Range): boolean {
  if (
    !range1.startDate ||
    !range2.startDate ||
    !range1.endDate ||
    !range2.endDate
  ) {
    return false;
  }
  return (
    isSameDay(range1.startDate, range2.startDate) &&
    isSameDay(range1.endDate, range2.endDate)
  );
}
