/**
 * Calculates dynamic points for a challenge based on CTFd algorithm.
 * 
 * @param initial - Initial points (e.g. 500)
 * @param minimum - Minimum points (e.g. 100)
 * @param decay - Decay value (e.g. 25)
 * @param solves - Number of current solves
 * @returns Calculated points
 */
export function calculateDynamicPoints(
  initial: number,
  minimum: number,
  decay: number,
  solves: number
): number {
  if (solves === 0) return initial;
  
  // CTFd dynamic scoring formula:
  // p = (((min - initial) / (decay ** 2)) * (solves ** 2)) + initial
  // but many use a simpler version or the one above. 
  // Let's use the one that feels most consistent.
  
  const points = (((minimum - initial) / Math.pow(decay, 2)) * Math.pow(solves, 2)) + initial;
  
  return Math.max(minimum, Math.round(points));
}
