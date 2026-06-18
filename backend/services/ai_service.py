import os
import json
from typing import List
from openai import OpenAI
from dotenv import load_dotenv

from schemas.models import (
  DecisionExtraction, BeliefGraph, BeliefNode, BeliefEdge,
  Assumption, Scenario, TradeoffAnalysis, FutureTradeoff,
  TradeoffDimension, Contradiction, ReflectionQuestion,
  ActionPlan, ActionStep, DecisionContract
)

load_dotenv()


def _get_client() -> OpenAI:
  return OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


SYSTEM_PROMPT = """You are Parallax, an AI Decision Intelligence System.
You NEVER make decisions for users. You ONLY help them think clearly.

Your purpose is to extract structured reasoning from user input about high-stakes career decisions.
Output ONLY valid JSON. No markdown fences. No additional text."""


def _call_structured(prompt: str, response_format: type) -> dict:
  client = _get_client()
  completion = client.beta.chat.completions.parse(
    model="gpt-4o-2024-08-06",
    messages=[
      {"role": "system", "content": SYSTEM_PROMPT},
      {"role": "user", "content": prompt},
    ],
    response_format=response_format,
    temperature=0.3,
  )
  return json.loads(completion.choices[0].message.content)


def extract_decision(user_input: str) -> DecisionExtraction:
  prompt = f"""Extract the following from the user's input. Be precise and don't add anything not implied by the text.

User input: "{user_input}"

Extract:
- goals (what they want to achieve)
- constraints (rules, obligations, limitations)
- priorities (what matters most to them)
- fears (what they're afraid of)

Return as a JSON object with keys: goals, constraints, priorities, fears. Each value is an array of strings."""
  result = _call_structured(prompt, DecisionExtraction)
  return DecisionExtraction(**result)


def generate_belief_graph(extraction: DecisionExtraction) -> BeliefGraph:
  prompt = f"""Based on this decision extraction, generate a belief graph showing how the user's reasoning connects.

Goals: {extraction.goals}
Constraints: {extraction.constraints}
Priorities: {extraction.priorities}
Fears: {extraction.fears}

Create nodes (id, label, type) where type is one of: goal, constraint, priority, fear, action.
Create edges (source, target, label) showing causal/tradeoff relationships.

Return JSON with {{"nodes": [...], "edges": [...]}}."""
  result = _call_structured(prompt, BeliefGraph)
  return BeliefGraph(**result)


def stress_test_assumptions(extraction: DecisionExtraction) -> List[Assumption]:
  prompt = f"""Identify hidden assumptions in this user's reasoning.

Goals: {extraction.goals}
Constraints: {extraction.constraints}
Priorities: {extraction.priorities}
Fears: {extraction.fears}

For each assumption, return:
- assumption: what they're assuming
- evidence_strength: "Strong" | "Moderate" | "Weak"
- risk_level: "High" | "Medium" | "Low"
- explanation: what happens if this assumption fails

Return as JSON array with keys: assumption, evidence_strength, risk_level, explanation."""
  result = _call_structured(prompt, type("AssumptionList", (), {"__pydantic_model__": List[Assumption]}))
  return [Assumption(**a) for a in result]


def detect_contradictions(extraction: DecisionExtraction) -> List[Contradiction]:
  prompt = f"""Analyze this user's reasoning for contradictions or inconsistencies.

Goals: {extraction.goals}
Constraints: {extraction.constraints}
Priorities: {extraction.priorities}
Fears: {extraction.fears}

For each contradiction, return:
- conflict: what conflicts
- explanation: why it's a contradiction
- severity: "High" | "Medium" | "Low"

Return as JSON array with keys: conflict, explanation, severity."""
  result = _call_structured(prompt, type("ContradictionList", (), {"__pydantic_model__": List[Contradiction]}))
  return [Contradiction(**c) for c in result]


def generate_scenarios(extraction: DecisionExtraction) -> List[Scenario]:
  prompt = f"""Generate 3 possible future scenarios for this user's situation.

Goals: {extraction.goals}
Constraints: {extraction.constraints}
Priorities: {extraction.priorities}
Fears: {extraction.fears}

Create:
- Future A: Accept the current offer
- Future B: Wait for a better opportunity
- Future C: A hybrid strategy

For each, return:
- future: name/label
- description: what happens
- upside: benefits
- downside: risks
- critical_assumptions: what must be true
- confidence: "High" | "Medium" | "Low"

IMPORTANT: These are exploratory scenarios, not predictions.

Return as JSON array with keys: future, description, upside, downside, critical_assumptions, confidence."""
  result = _call_structured(prompt, type("ScenarioList", (), {"__pydantic_model__": List[Scenario]}))
  return [Scenario(**s) for s in result]


def analyze_tradeoffs(scenarios: List[Scenario]) -> TradeoffAnalysis:
  prompt = f"""Analyze these scenarios across decision dimensions.

Scenarios:
{json.dumps([s.model_dump() for s in scenarios], indent=2)}

Dimensions: Financial Stability, Career Growth, Learning, Risk, Flexibility, Family Impact

For each scenario, score each dimension 0-10.

Return JSON with:
- dimensions: list of dimension names
- futures: array of {{"future": name, "scores": [{{"dimension": name, "value": 0-10}},...]}}

NEVER rank futures. Only compare."""
  result = _call_structured(prompt, TradeoffAnalysis)
  return TradeoffAnalysis(**result)


def generate_reflection_questions(extraction: DecisionExtraction, assumptions: List[Assumption], contradictions: List[Contradiction]) -> List[ReflectionQuestion]:
  prompt = f"""Generate 3-5 adaptive reflection questions to help this user think more clearly.

Extraction:
Goals: {extraction.goals}
Fears: {extraction.fears}
Priorities: {extraction.priorities}

Key assumptions detected: {[a.assumption for a in assumptions[:2]]}
Contradictions detected: {[c.conflict for c in contradictions[:2]]}

Questions should:
- Challenge assumptions
- Surface hidden tradeoffs
- Help clarify what they'd regret
- NOT steer toward any specific choice

Return as JSON array of strings with key: question."""
  result = _call_structured(prompt, type("ReflectionList", (), {"__pydantic_model__": List[ReflectionQuestion]}))
  return [ReflectionQuestion(**r) for r in result]


def generate_decision_contract(decision: str, all_assumptions: List[Assumption], all_scenarios: List[Scenario]) -> DecisionContract:
  prompt = f"""Generate a decision contract for this choice.

Decision: {decision}

Relevant assumptions: {json.dumps([a.model_dump() for a in all_assumptions], indent=2)}
Scenarios considered: {json.dumps([s.model_dump() for s in all_scenarios], indent=2)}

Return JSON with:
- decision: the stated decision
- reasoning: array of key reasoning points (max 4)
- known_tradeoffs: array of tradeoffs they're accepting (max 3)

This records their reasoning, not correctness."""
  result = _call_structured(prompt, DecisionContract)
  return DecisionContract(**result)


def generate_action_plan(decision: str, extraction: DecisionExtraction) -> ActionPlan:
  prompt = f"""Create an action plan for someone who decided: {decision}

Context - their goals: {extraction.goals}, constraints: {extraction.constraints}, fears: {extraction.fears}

Return JSON with:
- plan_30_day: array of {{"title": str, "description": str, "timeframe": "30-day"}}
- plan_60_day: array of {{"title": str, "description": str, "timeframe": "60-day"}}
- plan_90_day: array of {{"title": str, "description": str, "timeframe": "90-day"}}
- risk_mitigation: array of strings
- assumptions_to_validate: array of strings
- first_action: string (the very first thing to do)

Be specific and actionable."""
  result = _call_structured(prompt, ActionPlan)
  return ActionPlan(**result)
