from pydantic import BaseModel, RootModel
from typing import List, Optional


class UserInput(BaseModel):
    message: str


class DecisionExtraction(BaseModel):
    goals: List[str]
    constraints: List[str]
    priorities: List[str]
    fears: List[str]


class BeliefNode(BaseModel):
    id: str
    label: str
    type: str  # goal | constraint | priority | fear | action


class BeliefEdge(BaseModel):
    source: str
    target: str
    label: str


class BeliefGraph(BaseModel):
    nodes: List[BeliefNode]
    edges: List[BeliefEdge]


class Assumption(BaseModel):
    assumption: str
    evidence_strength: str
    risk_level: str
    explanation: str


class AssumptionList(RootModel):
    root: List[Assumption]


class Scenario(BaseModel):
    future: str
    description: str
    upside: str
    downside: str
    critical_assumptions: str
    confidence: str


class ScenarioList(RootModel):
    root: List[Scenario]


class TradeoffDimension(BaseModel):
    dimension: str
    value: float


class FutureTradeoff(BaseModel):
    future: str
    scores: List[TradeoffDimension]


class TradeoffAnalysis(BaseModel):
    dimensions: List[str]
    futures: List[FutureTradeoff]


class ReflectionQuestion(BaseModel):
    question: str


class ReflectionList(RootModel):
    root: List[ReflectionQuestion]


class ActionStep(BaseModel):
    title: str
    description: str
    timeframe: str


class ActionPlan(BaseModel):
    plan_30_day: List[ActionStep]
    plan_60_day: List[ActionStep]
    plan_90_day: List[ActionStep]
    risk_mitigation: List[str]
    assumptions_to_validate: List[str]
    first_action: str


class DecisionContract(BaseModel):
    decision: str
    reasoning: List[str]
    known_tradeoffs: List[str]


class Contradiction(BaseModel):
    conflict: str
    explanation: str
    severity: str


class ContradictionList(RootModel):
    root: List[Contradiction]


class FullAnalysis(BaseModel):
    extraction: DecisionExtraction
    belief_graph: BeliefGraph
    assumptions: List[Assumption]
    contradictions: List[Contradiction]
    scenarios: List[Scenario]
    tradeoffs: TradeoffAnalysis
    reflection_questions: List[ReflectionQuestion]
    decision_contract: Optional[DecisionContract] = None
    action_plan: Optional[ActionPlan] = None
