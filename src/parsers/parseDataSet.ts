// Libraries
import XLSX from 'xlsx';

// Types
import {
  RawPushOverSheet,
  ParsedPushOverSheet,
  RawStresStrainSheet,
  ParsedStresStrainSheet,
  ParsedMomentInfoSheet,
  ParsedDataSet,
} from '../types';

// Dependencies
import { approximateBinarySearch } from '../utils';

/**
 * > TODO: Description.
 * @param crushingStrainBreakpoint 
 * @param pushOverSheet 
 * @param stressStrainSheet 
 * @param momentInfoSheet 
 */
export function parseDataSet(
  crushingStrainBreakpoint: number,
  pushOverSheet: XLSX.WorkSheet,
  stressStrainSheet: XLSX.WorkSheet,
  momentInfoSheet: XLSX.WorkSheet,
): ParsedDataSet {
  const rawPushOverJson = XLSX.utils.sheet_to_json<RawPushOverSheet>(pushOverSheet);
  const rawStressStrainJson = XLSX.utils.sheet_to_json<RawStresStrainSheet>(stressStrainSheet);
  const rawMomentInfoSheet = XLSX.utils.sheet_to_json<ParsedMomentInfoSheet>(momentInfoSheet);

  const pushOverJson = rawPushOverJson.reduce<ParsedPushOverSheet[]>(
      (list, rawPushOverValue) => {
        if (
          typeof rawPushOverValue.WallProperties === 'number' &&
          typeof rawPushOverValue.Values === 'number' &&
          typeof rawPushOverValue.__EMPTY === 'number'
        ) {
          list.push({
            Var1: rawPushOverValue.WallProperties,
            Disp_mm: rawPushOverValue.Values,
            w: rawPushOverValue.__EMPTY,
          });
        }
        return list;
      },
      [],
    );
  const stressStrainJson = rawStressStrainJson.reduce<ParsedStresStrainSheet[]>(
      (list, rawPushOverValue) => {
        if (
          typeof rawPushOverValue['Stress-Strain Data'] === 'number' &&
          typeof rawPushOverValue.__EMPTY === 'number' &&
          typeof rawPushOverValue.__EMPTY_1 === 'number' &&
          typeof rawPushOverValue.__EMPTY_3 === 'number' &&
          typeof rawPushOverValue.__EMPTY_4 === 'number'
        ) {
          list.push({
            Var1: rawPushOverValue['Stress-Strain Data'],
            FmStrain: rawPushOverValue.__EMPTY,
            FmStress: rawPushOverValue.__EMPTY_1,
            FyStress: rawPushOverValue.__EMPTY_3,
            FyStrain: rawPushOverValue.__EMPTY_4,
          });
        }
        return list;
      },
      [],
    );;
  const momentInfoJson = rawMomentInfoSheet;

  if (
    momentInfoJson.length !== pushOverJson.length &&
    momentInfoJson.length !== stressStrainJson.length
  ) {
    throw new Error(`The amount of valid entries between the sheets are not the same.`);
  }

  /**
   * 1. Find the maximum value of Var1 (displacement increment) and its set.
   * 2. If the crushing strain of the set is GTE than the crushing strain breakpoint:
   *    2.1. Find the closest value to the breakpoint.
   *    2.2. The closest value is either slightly below or slightly above the crushing strain
   *         breakpoint, but we only want values above it. For this reason, if it's below, add one
   *         to the index value and get the most approximate value GREATER than the crushing strain
   *         breakpoint.
   *    2.3. Get the values from set above the crushing strain breakpoint closest to it.
   * 3. Otherwise, get the values from the set of the maximum value of Var1.
   */

  let index: number;

  const maxVar1StressStrainSet = stressStrainJson.reduce<{ set: ParsedStresStrainSheet, index: number }>(
    (maxParsedStresStrain, parsedStresStrain, index) => {
      if (parsedStresStrain.Var1 > maxParsedStresStrain.set.Var1) {
        return { set: parsedStresStrain, index };
      }
      return maxParsedStresStrain;
    },
    { set: stressStrainJson[0], index: 0 },
  );

  if (maxVar1StressStrainSet.set.FmStrain > crushingStrainBreakpoint) {
    index = approximateBinarySearch<ParsedStresStrainSheet>(
      stressStrainJson,
      crushingStrainBreakpoint,
      (stressStrainData) => stressStrainData.FmStrain,
    );
    if (stressStrainJson[index].FmStrain < crushingStrainBreakpoint) {
      index += 1;
    }
  } else {
    index = maxVar1StressStrainSet.index;
  }

  const pushOverData = pushOverJson[index];
  const stressStrainData = stressStrainJson[index];
  const momentInfoData = momentInfoJson[index];

  const axialLoad: number | undefined = rawPushOverJson.find(rawPushOverData => {
    return rawPushOverData.WallProperties === 'Axial Load(N)';
  })?.Values as number;

  const sectionThinkness: number | undefined = rawPushOverJson.find(rawPushOverData => {
    return rawPushOverData.WallProperties === 'Section Thickness(m)';
  })?.Values as number;

  const areaOfSteel: number | undefined = rawPushOverJson.find(rawPushOverData => {
    return rawPushOverData.WallProperties === 'Area of Steel(mm2)';
  })?.Values as number;

  const Fm: number | undefined = rawPushOverJson.find(rawPushOverData => {
    return rawPushOverData.WallProperties === 'Fm(MPa)';
  })?.Values as number;

  const wallHeight: number | undefined = rawPushOverJson.find(rawPushOverData => {
    return rawPushOverData.WallProperties === 'Wall Height(m)';
  })?.Values as number;

  const sr: number | undefined = Fm / wallHeight;

  return {
    // Push Over parameters
    'AL (N)': axialLoad,
    'TF (mm)': sectionThinkness,
    'As (mm2)': areaOfSteel,
    'Fm (Mpa)': Fm,
    'Wh (m)': wallHeight,
    'Sr': sr,
    // Stress Stain data
    'Strain F\'m (Mpa)': stressStrainData.FmStrain,
    'Stress Fm (Mpa)': stressStrainData.FmStress,
    'Stress Fy (Mpa)': stressStrainData.FyStress,
    'Strain F\'y (Mpa)': stressStrainData.FyStrain,
    // Push Over data
    'Disp (mm)': pushOverData.Disp_mm,
    // Moment Info data
    'M1 (kN-m)': momentInfoData.PrimaryMoment,
    'M2 (kN-m)': momentInfoData.SecondOrderM,
    'MT (kN-m)': momentInfoData.TotalMoment,
    'M2/Mt (%)': (momentInfoData.SecondOrderM * 100) / momentInfoData.TotalMoment,
  };
}
