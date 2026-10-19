export type Lang = "en" | "th" | "zh";

export type Tr = { en: string; th: string; zh: string };

export type Place = {
  id: string;
  code: string;
  en: string;
  th: string;
  zh: string;
  region: string;
  lat?: number | null;
  lon?: number | null;
  smartCityStatus?: string;
  smartCityProjects?: string;
  smartCitySource?: string;
  borderSez?: string;
  eec?: string;
  zoneSource?: string;
  nameSource?: string;
  notes?: string;
};

export type Locality = {
  id: string;
  en: string;
  th: string;
  zh: string;
  adminLevel: string;
  provinceId: string;
  provinceName: string;
  population: number | null;
  smartCityStatus: string;
  smartCityProjects: string;
  smartCitySource: string;
  nameSource: string;
};

export type Area = { id: string; en: string; th: string; zh: string };

export type Indicator = {
  id: string;
  area: string;
  status: string;
  direction?: string;
  licence?: string;
  unit: Tr;
  name: Tr;
  sourceName: Tr;
  sourceUrl: string;
  method: Tr;
};

export type Observation = {
  indicatorId: string;
  placeId: string;
  period: string;
  value: number;
  unit?: string;
  asOf: string;
  sourceUrl: string;
  publisher?: string;
  licence?: string;
  stale?: boolean;
  note?: string;
  fetchedAt?: string;
  stations?: number;
};

export type Baseline = {
  version: string;
  generatedAt: string;
  places: Place[];
  localities?: Locality[];
  areas: Area[];
  indicators: Indicator[];
  observations: Observation[];
  runs?: { id: string; ok?: boolean; tlsRelaxed?: boolean; error?: string }[];
  gaps?: { id: string; url?: string; status?: number; error?: string }[];
  incoming?: { files: string[]; accepted: number; rejected: { reason: string }[] };
};

export type GeoFeature = { id: string; code: string; shapeName: string; d: string };
export type GeoFile = { viewBox: string; attribution: string; sourceUrl?: string; features: GeoFeature[] };

export type ComponentSpec = {
  id: string;
  kind: "raw" | "cagr" | "ratio" | "flag";
  indicatorId?: string;
  numeratorId?: string;
  denominatorId?: string;
  direction: "higher" | "lower";
  weight: number;
  decisive: boolean;
  sinceYear?: number;
  missingAsZero?: boolean;
  scale?: "log1p-minmax";
  display?: { mul: number; digits: number; unit: Tr };
  name: Tr;
  note: Tr;
};

export type Lens = {
  id: string;
  proposed: boolean;
  rankGate: string;
  name: Tr;
  question: Tr;
  caveat: Tr;
  components: ComponentSpec[];
};

export type Evidence = {
  period: string;
  asOf: string;
  sourceUrl: string;
  publisher: string;
  licence: string;
  stale?: boolean;
  absentAsZero?: boolean;
  fromYear?: number;
  toYear?: number;
  earlierSourceUrl?: string;
  denominatorSourceUrl?: string;
};

export type Part = {
  id: string;
  weight: number;
  direction: "higher" | "lower";
  kind: string;
  decisive: boolean;
  state: string;
  value: number | null;
  percentile: number | null;
  oriented: number | null;
  contribution: number | null;
  places: number;
  evidence: Evidence | null;
};

export type ScoreRow = {
  placeId: string;
  score: number | null;
  rank: number | null;
  coverage: { have: number; of: number };
  partial: boolean;
  missingInFile: string[];
  notInFile: string[];
  parts: Part[];
};

export type ScoreCard = {
  contextOnly: boolean;
  contextReason: string | null;
  inFile: { id: string; places: number; kind: string; decisive: boolean }[];
  notInFile: string[];
  zeroWeight: string[];
  rows: ScoreRow[];
};
