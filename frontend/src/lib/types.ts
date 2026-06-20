export interface DecisionExtraction {
  goals: string[];
  constraints: string[];
  priorities: string[];
  fears: string[];
}

export interface BeliefNode {
  id: string;
  label: string;
  type: "goal" | "constraint" | "priority" | "fear" | "action";
}

export interface BeliefEdge {
  source: string;
  target: string;
  label: string;
}

export interface BeliefGraph {
  nodes: BeliefNode[];
  edges: BeliefEdge[];
}

export interface Assumption {
  assumption: string;
  evidence_strength: string;
  risk_level: string;
  explanation: string;
}

export interface Scenario {
  future: string;
  description: string;
  upside: string;
  downside: string;
  critical_assumptions: string;
  confidence: string;
}

export interface TradeoffDimension {
  dimension: string;
  value: number;
}

export interface FutureTradeoff {
  future: string;
  scores: TradeoffDimension[];
}

export interface TradeoffAnalysis {
  dimensions: string[];
  futures: FutureTradeoff[];
}

export interface ReflectionQuestion {
  question: string;
}

export interface ReflectionEvaluation {
  clarity_score: number;
  blind_spots: string[];
  key_insights: string[];
  is_ready: boolean;
  summary: string;
}

export interface Contradiction {
  conflict: string;
  explanation: string;
  severity: string;
}

export interface ActionStep {
  title: string;
  description: string;
  timeframe: string;
}

export interface ActionPlan {
  plan_30_day: ActionStep[];
  plan_60_day: ActionStep[];
  plan_90_day: ActionStep[];
  risk_mitigation: string[];
  assumptions_to_validate: string[];
  first_action: string;
}

export interface DecisionContract {
  decision: string;
  reasoning: string[];
  known_tradeoffs: string[];
}

export interface FullAnalysis {
  extraction: DecisionExtraction;
  belief_graph: BeliefGraph;
  assumptions: Assumption[];
  contradictions: Contradiction[];
  scenarios: Scenario[];
  tradeoffs: TradeoffAnalysis;
  reflection_questions: ReflectionQuestion[];
  decision_contract?: DecisionContract;
  action_plan?: ActionPlan;
}
