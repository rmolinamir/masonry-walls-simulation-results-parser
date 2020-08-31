// Libraries
import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';

// Types
import { ParsedDataSet } from '../types';

// Dependencies
import { parseDataSet } from '../parsers';
import { mergeSort } from '../utils';

// Only match .xlsx file formats and ignore temporary files flagged with the `~` character. 
const VALID_XLSX_FILE_REGEXP = /^(?=.*.xlsx)((?!~).).*$/g;

/**
 * > TODO: Description.
 * @param outputDir 
 * @param outputFileName 
 * @param crushingStrainBreakpoint 
 * @param pushOverSheet 
 * @param stressStrainSheet 
 * @param momentInfoSheet 
 */
export function parseDataSets(
  inputDir: string,
  crushingStrainBreakpoint: number,
  pushOverSheetName: string,
  stressStrainSheetName: string,
  momentInfoSheetName: string,
): ParsedDataSet[] {
  const files = fs.readdirSync(inputDir);

  if (!files.length) {
    console.error(`ERROR: No files found at [${inputDir}].`);
    process.exit(1);
  }

  const parsedDataSet: ParsedDataSet[] = [];

  files.forEach(file => {
    console.info(`INFO: Reading and processing content of file: [${file}]...`);
    // Checking the format of the files:
    if (file.match(VALID_XLSX_FILE_REGEXP)) {
      const workbook = XLSX.readFile(path.resolve(inputDir, file));
      
      const pushOverSheet: XLSX.WorkSheet = workbook.Sheets[pushOverSheetName];
      const stressStrainSheet: XLSX.WorkSheet = workbook.Sheets[stressStrainSheetName];
      const momentInfoSheet: XLSX.WorkSheet = workbook.Sheets[momentInfoSheetName];
    
      const dataSet = parseDataSet(
        crushingStrainBreakpoint,
        pushOverSheet,
        stressStrainSheet,
        momentInfoSheet,
      );
    
      parsedDataSet.push(dataSet);
    } else {
      console.warn(`WARN: Found file with incorrect format: [${file}]...`);
    }
  });

  console.info(`INFO: Sorting data set based on Axial Load values...`);

  const now = (new Date()).getTime();

  const sortedParsedDataSet = mergeSort<ParsedDataSet>(
    parsedDataSet,
    (stressStrainData) => stressStrainData["AL (N)"],
  );

  const then = (new Date()).getTime();

  console.info(`INFO: Successfully sorted data in ${then - now} millisecond(s).`);

  return sortedParsedDataSet;
}
