import os
import json
from typing import List
from google import genai
from google.genai import types
from dotenv import load_dotenv

from schemas.models import (
    DecisionExtraction, BeliefGraph, BeliefNode, BeliefEdge,
    Assumption, AssumptionList, Scenario, ScenarioList,
    TradeoffAnalysis, FutureTradeoff, TradeoffDimension,
    Contradiction, ContradictionList, ReflectionQuestion, ReflectionList,
    ActionPlan, ActionStep, DecisionContract, ReflectionEvaluation,
)

load_dotenv()

MODEL = "gemini-2.5-flash"

SYSTEM_PROMPT = """You are Parallax, an AI Decision Intelligence System.
You NEVER make decisions for users. You ONLY help them think clearly.
Your purpose is to extract structured reasoning from user input about any high-stakes decision.
Output ONLY valid JSON matching the exact schema requested. No markdown fences. No extra text."""


from tenacity import retry, wait_exponential, stop_after_attempt

def _get_client() -> genai.Client:
    creds_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS", "key.json")
    if not os.path.isabs(creds_path):
        creds_path = os.path.join(os.path.dirname(__file__), "..", creds_path)
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = os.path.abspath(creds_path)
    return genai.Client(
        vertexai=True,
        project=os.getenv("GOOGLE_CLOUD_PROJECT", "apikey2-494409"),
        location=os.getenv("GOOGLE_CLOUD_LOCATION", "us-central1"),
    )

@retry(wait=wait_exponential(multiplier=1, min=2, max=10), stop=stop_after_attempt(5))
def _call_json(prompt: str) -> dict | list:
    client = _get_client()
    response = client.models.generate_content(
        model=MODEL,
        contents=prompt,
        config=types.GenerateContentConfig(
            system_instruction=SYSTEM_PROMPT,
            response_mime_type="application/json",
            temperature=0.3,
        ),
    )
    return json.loads(response.text)


def extract_decision(user_input: str) -> DecisionExtraction:
    prompt = f"""Extract structured decision data from the user's input.

User input: "{user_input}"

Return JSON with these exact keys:
- goals: array of strings (what they want to achieve)
- constraints: array of strings (rules, obligations, limits)
- priorities: array of strings (what matters most)
- fears: array of strings (what they are afraid of)"""
    result = _call_json(prompt)
    return DecisionExtraction(**result)


def generate_belief_graph(extraction: DecisionExtraction) -> BeliefGraph:
    prompt = f"""Generate a belief graph showing how this person's reasoning connects.

Goals: {extraction.goals}
Constraints: {extraction.constraints}
Priorities: {extraction.priorities}
Fears: {extraction.fears}

Return JSON with:
- nodes: array of objects with id (string), label (string), type (one of: goal, constraint, priority, fear, action)
- edges: array of objects with source (node id), target (node id), label (string describing the relationship)

Create 6-10 nodes and 5-9 edges showing causal and tradeoff relationships."""
    result = _call_json(prompt)
    return BeliefGraph(**result)


def stress_test_assumptions(extraction: DecisionExtraction) -> List[Assumption]:
    prompt = f"""Identify 3-5 hidden assumptions in this person's reasoning.

Goals: {extraction.goals}
Constraints: {extraction.constraints}
Priorities: {extraction.priorities}
Fears: {extraction.fears}

Return a JSON array where each item has:
- assumption: string (what they are assuming)
- evidence_strength: string, one of: Strong, Moderate, Weak
- risk_level: string, one of: High, Medium, Low
- explanation: string (what happens if this assumption fails)"""
    result = _call_json(prompt)
    items = result if isinstance(result, list) else result.get("assumptions", result.get("root", []))
    return [Assumption(**a) for a in items]


def detect_contradictions(extraction: DecisionExtraction) -> List[Contradiction]:
    prompt = f"""Find contradictions or inconsistencies in this person's reasoning.

Goals: {extraction.goals}
Constraints: {extraction.constraints}
Priorities: {extraction.priorities}
Fears: {extraction.fears}

Return a JSON array where each item has:
- conflict: string (what conflicts with what)
- explanation: string (why this is a contradiction)
- severity: string, one of: High, Medium, Low

Find 2-4 contradictions. Do not judge — only identify inconsistencies."""
    result = _call_json(prompt)
    items = result if isinstance(result, list) else result.get("contradictions", result.get("root", []))
    return [Contradiction(**c) for c in items]


def generate_scenarios(extraction: DecisionExtraction) -> List[Scenario]:
    prompt = f"""Generate exactly 3 distinct possible future scenarios based on this person's situation.

Goals: {extraction.goals}
Constraints: {extraction.constraints}
Priorities: {extraction.priorities}
Fears: {extraction.fears}

The three scenarios should represent meaningfully different paths forward. Let the user's specific context determine what they are — do not assume a career context.

Return a JSON array where each item has:
- future: string (name/label like "Scenario A: [short descriptive name]")
- description: string (what happens in this future)
- upside: string (key benefits)
- downside: string (key risks)
- critical_assumptions: string (what must be true for this to work)
- confidence: string, one of: High, Medium, Low

IMPORTANT: These are exploratory scenarios, not predictions."""
    result = _call_json(prompt)
    items = result if isinstance(result, list) else result.get("scenarios", result.get("root", []))
    return [Scenario(**s) for s in items]


def analyze_tradeoffs(scenarios: List[Scenario]) -> TradeoffAnalysis:
    prompt = f"""Score these scenarios across relevant decision dimensions.

Scenarios:
{json.dumps([s.model_dump() for s in scenarios], indent=2)}

First, determine 4-6 decision dimensions that are most relevant to this specific situation (based on the scenarios). Then score each scenario against each dimension.

Return JSON with:
- dimensions: array of dimension names (strings)
- futures: array of objects with:
  - future: string (scenario name)
  - scores: array of objects with dimension (string) and value (number 0-10)

Never rank the futures. Only compare them. Dimensions should reflect what actually matters in this situation."""
    result = _call_json(prompt)
    return TradeoffAnalysis(**result)


def generate_reflection_questions(
    extraction: DecisionExtraction,
    assumptions: List[Assumption],
    contradictions: List[Contradiction],
) -> List[ReflectionQuestion]:
    prompt = f"""Generate 4-5 reflection questions to help this person think more clearly.

Goals: {extraction.goals}
Fears: {extraction.fears}
Priorities: {extraction.priorities}
Key assumptions: {[a.assumption for a in assumptions[:3]]}
Contradictions found: {[c.conflict for c in contradictions[:2]]}

Questions must:
- Challenge key assumptions
- Surface hidden tradeoffs
- Help clarify what they would regret
- NOT push toward any specific choice

Return a JSON array where each item has:
- question: string"""
    result = _call_json(prompt)
    items = result if isinstance(result, list) else result.get("questions", result.get("root", []))
    return [ReflectionQuestion(**r) if isinstance(r, dict) else ReflectionQuestion(question=r) for r in items]


def evaluate_reflections(
    extraction: DecisionExtraction,
    questions: List[ReflectionQuestion],
    answers: List[str],
) -> ReflectionEvaluation:
    qa_pairs = "\n".join(
        f"Q{i+1}: {q.question}\nA{i+1}: {answers[i] if i < len(answers) else '(no answer)'}"
        for i, q in enumerate(questions)
    )
    prompt = f"""Evaluate this person's reflection responses and assess their decision readiness.

Context:
Goals: {extraction.goals}
Constraints: {extraction.constraints}
Priorities: {extraction.priorities}
Fears: {extraction.fears}

Their reflection answers:
{qa_pairs}

Return JSON with:
- clarity_score: number 0-10 (how clear and thoughtful their answers are)
- blind_spots: array of strings (remaining blind spots or unaddressed areas)
- key_insights: array of strings (important realizations from their answers)
- is_ready: boolean (whether they appear ready to make a decision)
- summary: string (a brief 2-3 sentence evaluation)

Be constructive and honest. Do not flatter or push toward any choice."""
    result = _call_json(prompt)
    return ReflectionEvaluation(**result)


def generate_decision_contract(
    decision: str,
    all_assumptions: List[Assumption],
    all_scenarios: List[Scenario],
) -> DecisionContract:
    prompt = f"""Generate a decision contract for this person's choice.

Decision: {decision}
Assumptions considered: {json.dumps([a.model_dump() for a in all_assumptions], indent=2)}
Scenarios considered: {json.dumps([s.model_dump() for s in all_scenarios], indent=2)}

Return JSON with:
- decision: string (the stated decision)
- reasoning: array of strings (3-4 key reasoning points)
- known_tradeoffs: array of strings (2-3 tradeoffs they are accepting)

This records their reasoning, not whether it is correct."""
    result = _call_json(prompt)
    return DecisionContract(**result)


def generate_action_plan(decision: str, extraction: DecisionExtraction) -> ActionPlan:
    prompt = f"""Create a 90-day action plan for: {decision}

Context:
Goals: {extraction.goals}
Constraints: {extraction.constraints}
Fears: {extraction.fears}

Return JSON with:
- plan_30_day: array of objects with title (string), description (string), timeframe ("30-day")
- plan_60_day: array of objects with title (string), description (string), timeframe ("60-day")
- plan_90_day: array of objects with title (string), description (string), timeframe ("90-day")
- risk_mitigation: array of strings (2-3 risk mitigation steps)
- assumptions_to_validate: array of strings (2-3 assumptions to verify quickly)
- first_action: string (the single most important first step)

Be specific and actionable."""
    result = _call_json(prompt)
    return ActionPlan(**result)
