import { formatDemandCapacity } from './message-formatter';

describe('formatDemandCapacity()', () => {
  test('should work', () => {
    const normal = formatDemandCapacity([40000, 50000]);
    expect(normal).toEqual('Demand: 40GW Capacity: 50GW 🆗');

    const warning = formatDemandCapacity([49600, 50000]);
    expect(warning).toEqual('Demand: 49.6GW Capacity: 50GW ⚠️');

    const emergency = formatDemandCapacity([51000, 50000]);
    expect(emergency).toEqual('Demand: 51GW Capacity: 50GW 🚨');
  });
});
