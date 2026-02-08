
export interface Contribution {
  id: string;
  author: string;
  content: string;
  timestamp: number;
}

export interface EtymologyNote {
  term: string;
  origin: string;
  meaning: string;
}

export interface SchoolOfThought {
  name: string;
  description: string;
  prevalence: string; // e.g. "Dominant", "Minority", "Emergent"
}

export interface ConsensusSummary {
  id: string;
  version: number;
  unifiedDefinition: string;
  schoolsOfThought: SchoolOfThought[];
  keyPoints: string[];
  etymologyNotes: EtymologyNote[];
  exegeticalInsights: string[];
  hermeneuticalFramework: string;
  scripturalFoundations: { reference: string; summary: string }[];
  evolutionNote: string;
  alignmentScore: number;
  syncedAt: number;
}

export interface Topic {
  title: string;
  initialStatement: string;
  contributions: Contribution[];
  currentConsensus?: ConsensusSummary;
  consensusHistory: ConsensusSummary[];
  lastUpdated: number;
}
