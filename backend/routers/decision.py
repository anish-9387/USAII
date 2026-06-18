from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from schemas.models import (
  UserInput, DecisionExtraction, BeliefGraph, Assumption,
  Contradiction, Scenario, TradeoffAnalysis, ReflectionQuestion,
  DecisionContract, ActionPlan, FullAnalysis
)
from services import ai_service

router = APIRouter(prefix="/api", tags=["decision"])


class ContractRequest(BaseModel):
  decision: str
  analysis: FullAnalysis


class ActionPlanRequest(BaseModel):
  decision: str
  extraction: DecisionExtraction


@router.post("/analyze", response_model=FullAnalysis)
async def analyze_decision(body: UserInput):
  try:
    extraction = ai_service.extract_decision(body.message)
    belief_graph = ai_service.generate_belief_graph(extraction)
    assumptions = ai_service.stress_test_assumptions(extraction)
    contradictions = ai_service.detect_contradictions(extraction)
    scenarios = ai_service.generate_scenarios(extraction)
    tradeoffs = ai_service.analyze_tradeoffs(scenarios)
    questions = ai_service.generate_reflection_questions(extraction, assumptions, contradictions)

    return FullAnalysis(
      extraction=extraction,
      belief_graph=belief_graph,
      assumptions=assumptions,
      contradictions=contradictions,
      scenarios=scenarios,
      tradeoffs=tradeoffs,
      reflection_questions=questions,
    )
  except Exception as e:
    raise HTTPException(status_code=500, detail=str(e))


@router.post("/contract", response_model=DecisionContract)
async def generate_contract(body: ContractRequest):
  try:
    contract = ai_service.generate_decision_contract(body.decision, body.analysis.assumptions, body.analysis.scenarios)
    return contract
  except Exception as e:
    raise HTTPException(status_code=500, detail=str(e))


@router.post("/action-plan", response_model=ActionPlan)
async def generate_action_plan(body: ActionPlanRequest):
  try:
    plan = ai_service.generate_action_plan(body.decision, body.extraction)
    return plan
  except Exception as e:
    raise HTTPException(status_code=500, detail=str(e))
