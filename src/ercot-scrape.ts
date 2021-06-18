import fetch from 'node-fetch';

function headers(accept = 'text/html') {
  return {
    headers: {
      Accept: accept,
      'User-Agent': 'Node.js (+https://github.com/nik0kin/matrix-ercot-bot)',
    },
  };
}

// Adapted from grid.ts in Gist by @danopia
//  https://gist.github.com/danopia/c0c4313b4809d565af7c7738bcdbeec7
export async function getScrapedErcotData(): Promise<[number, number]> {
  const demandCapacity: [number, number] = [-1, -1];

  const body = await fetch(
    'http://ercot.com/content/cdr/html/real_time_system_conditions.html',
    headers('text/html')
  ).then((x) => x.text());

  const sections = body.split('an="2">').slice(1);
  for (const section of sections) {
    // const label = section.slice(0, section.indexOf('<'));
    const boxes =
      section.match(
        / {4}<td class="tdLeft">[^<]+<\/td>\r\n {4}<td class="labelClassCenter">[^<]+<\/td>/g
      ) ?? [];
    for (const box of boxes) {
      const parts = box.split(/[<>]/);
      // console.log(label, parts[2], parts[6]);
      if (parts[2] === 'Actual System Demand') {
        demandCapacity[0] = parseFloat(parts[6]);
      } else if (
        parts[2] === 'Total System Capacity (not including Ancillary Services)'
      ) {
        demandCapacity[1] = parseFloat(parts[6]);
      }
    }
  }

  // console.log(new Date(), 'grid', demandCapacity);

  return demandCapacity;
}
