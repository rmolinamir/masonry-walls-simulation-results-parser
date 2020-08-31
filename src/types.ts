export interface RawPushOverSheet {
  WallProperties: string;
  Values: string | number;
  __EMPTY: string | number | null;
}

export interface ParsedPushOverSheet {
  Var1: number;
  Disp_mm: number;
  w: number;
}

export interface RawStresStrainSheet {
  'Stress-Strain Data': string | number;
  '__EMPTY': string | number;
  '__EMPTY_1': string | number;
  '__EMPTY_3': string | number;
  '__EMPTY_4': string | number;
}

export interface ParsedStresStrainSheet {
  Var1: number;
  FmStrain: number;
  FmStress: number;
  FyStress: number;
  FyStrain: number;

}

export interface ParsedMomentInfoSheet {
  Var1: number;
  PrimaryMoment: number;
  SecondOrderM: number;
  TotalMoment: number;
}

export interface ParsedDataSet {
  // Axial Load(N)
  // S1_B9
  'AL (N)': number;

  // Section Thickness(m)
  // S1_B2
  'TF (mm)': number;

  // Area of Steel(mm2)
  // S1_B5
  'As (mm2)': number;

  // Fm(MPa)
  // S1_B6
  'Fm (Mpa)': number;

  // Wall Height(m)
  // S1_B4
  'Wh (m)': number;

  // Sr
  // Wh/TF
  'Sr': number;

  // S2_Cx
  'Strain F\'m (Mpa)': number;

  // S2_Dx
  'Stress Fm (Mpa)': number;

  // S2_Fx
  'Stress Fy (Mpa)': number;

  // S2_Gx
  'Strain F\'y (Mpa)': number;

  // S1_B(x+12)
  'Disp (mm)': number;

  // S5_Cx
  'M1 (kN-m)': number;

  // S5_Dx
  'M2 (kN-m)': number;

  // S5_Ex
  'MT (kN-m)': number;

  // M2/Mt *100
  'M2/Mt (%)': number;
}
