// backend/utils/gdeltEventParser.js

const axios = require('axios');
const unzipper = require('unzipper');
const { parse } = require('csv-parse');

const GDELT_LAST_UPDATE_URL = 'http://data.gdeltproject.org/gdeltv2/lastupdate.txt';

/**
 * Fetches the latest 15-minute GDELT Event CSV and extracts active military/rebel conflicts.
 */
async function fetchDynamicGdeltEvents() {
  try {
    // 1. Get the URL of the latest 15-minute export zip
    const { data: updateTxt } = await axios.get(GDELT_LAST_UPDATE_URL);
    const latestExportUrl = updateTxt.split('\n')[0].split(' ')[2];
    
    if (!latestExportUrl) throw new Error('Could not parse GDELT lastupdate.txt');
    console.log(`[GDELT Events] Fetching latest stream: ${latestExportUrl}`);

    // 2. Fetch the ZIP file as a stream
    const response = await axios({
      method: 'get',
      url: latestExportUrl,
      responseType: 'stream'
    });

    // 3. Unzip and parse the TSV (Tab-Separated Values) on the fly
    const dynamicArcs = new Map();

    return new Promise((resolve, reject) => {
      response.data
        .pipe(unzipper.ParseOne()) // Extract the single CSV file inside the ZIP
        .pipe(parse({
          delimiter: '\t',
          relax_quotes: true,
          relax_column_count: true,
          skip_empty_lines: true
        }))
        .on('data', (row) => {
          // GDELT V2 Event Column Indices:
          // 7: Actor1CountryCode, 17: Actor2CountryCode, 26: EventRootCode, 56: ActionLat, 57: ActionLng
          
          const actor1 = row[7];
          const actor2 = row[17];
          const eventRootCode = row[26];
          const lat = parseFloat(row[56]);
          const lng = parseFloat(row[57]);

          // Filter for violence/conflict events: 
          // 18 (Assault), 19 (Fight), 20 (Use unconventional mass violence)
          if (['18', '19', '20'].includes(eventRootCode) && actor1 && actor2 && !isNaN(lat) && !isNaN(lng)) {
            
            // Create a unique key for this conflict pair (alphabetical to avoid duplicates A->B and B->A)
            const pairKey = [actor1, actor2].sort().join('-');

            // Only add if it's an inter-state conflict or significant internal clash
            if (actor1 !== actor2) {
              if (!dynamicArcs.has(pairKey)) {
                dynamicArcs.set(pairKey, {
                  startIso3: actor1,
                  endIso3: actor2,
                  conflict_name: `${actor1}-${actor2} Dynamic Conflict`,
                  startLat: lat, // You would map actor1 to your PostgreSQL country centroid here
                  startLng: lng,
                  endLat: lat,   // Action location
                  endLng: lng,
                  is_active: true,
                  arc_type: 'dynamic-discovery',
                  intensity_level: eventRootCode === '20' ? 3 : 2, // Highlight mass violence
                  source: 'gdelt-live-events'
                });
              }
            }
          }
        })
        .on('end', () => {
          const newConflicts = Array.from(dynamicArcs.values());
          console.log(`[GDELT Events] Dynamically discovered ${newConflicts.length} active conflict zones.`);
          resolve(newConflicts);
        })
        .on('error', (err) => {
          reject(err);
        });
    });

  } catch (error) {
    console.error('[GDELT Events] Error fetching dynamic events:', error.message);
    return [];
  }
}

module.exports = { fetchDynamicGdeltEvents };