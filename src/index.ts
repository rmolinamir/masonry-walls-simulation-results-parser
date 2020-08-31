// Libraries
import * as json2csv from 'json2csv';
import path from 'path';
import fs from 'fs';

// Dependencies
import { parseDataSets } from './parsers';

//
// PARAMETERS
//

const INPUT_DIR = path.resolve(__dirname, '..', 'samples');
const OUTPUT_DIR = path.resolve(__dirname, '..', 'tmp');
const OUTPUT_FILENAME = 'results';
const OUTPUT_FORMAT: 'csv' | 'json' = 'csv';
const CRUSHING_STRAIN_BREAKPOINT = 0.0029;
const PUSH_OVER_SHEET = 'Sheet1';
const STRESS_STRAIN_SHEET = 'Sheet2';
const MOMENT_INFO_SHEET = 'Sheet5';

//
// IMPLEMENTATION
//

console.info(`Parsing data sets found in: [${INPUT_DIR}]...`);

const parsedDataSets = parseDataSets(
  INPUT_DIR,
  CRUSHING_STRAIN_BREAKPOINT,
  PUSH_OVER_SHEET,
  STRESS_STRAIN_SHEET,
  MOMENT_INFO_SHEET,
);

console.info(`INFO: Parsed ${parsedDataSets.length} data sets.`);

const outputLocation = path.resolve(OUTPUT_DIR, `${OUTPUT_FILENAME}.${OUTPUT_FORMAT}`);

console.info(`INFO: Writing data sets in: [${outputLocation}]...`);

// Writing file:
switch (OUTPUT_FORMAT as 'csv' | 'json') {
  case 'json': {
    fs.writeFileSync(
      outputLocation,
      JSON.stringify(parsedDataSets, null, 2),
    );
    break;
  }
  case 'csv': {
    const csv = json2csv.parse(parsedDataSets);
    fs.writeFileSync(
      outputLocation,
      csv,
    );
    break;
  }
}

console.info(`INFO: Successfuly wrote output file.`);
