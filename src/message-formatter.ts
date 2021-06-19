const WARNING_ZONE = 500; // in MW

export function formatDemandCapacity([demand, capacity]: [number, number]) {
  const emoji =
    demand > capacity ? '🚨' : demand + WARNING_ZONE > capacity ? '⚠️' : '🆗';
  return `Demand: ${formatNumber(demand / 1000, 3)}GW Capacity: ${formatNumber(
    capacity / 1000,
    3
  )}GW ${emoji}`;
}

function formatNumber(num: number, decimalPlaces = 2) {
  const a = Math.pow(10, decimalPlaces);
  num = Math.round(num * a) / a;
  return `${num}`;
}
