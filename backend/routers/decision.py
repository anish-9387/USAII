import asyncio
from concurrent.futures import ThreadPoolExecutor
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from schemas.models import (
  UserInput, DecisionExtraction, BeliefGraph, Assumption,
  Contradiction, Scenario, TradeoffAnalysis, ReflectionQuestion,
  DecisionContract, ActionPlan, FullAnalysis
)
from services import ai_service

router = APIRouter(prefix="/api", tags=["decision"])

_executor = ThreadPoolExecutor(max_workers=8)


def _run(fn, *args):
  loop = asyncio.get_event_loop()
  return loop.run_in_executor(_executor, fn, *args)


class ContractRequest(BaseModel):
  decision: str
  analysis: FullAnalysis


class ActionPlanRequest(BaseModel):
  decision: str
  extraction: DecisionExtraction


@router.post("/analyze", response_model=FullAnalysis)
async def analyze_decision(body: UserInput):
  try:
    # Step 1: extraction (everything else depends on this)
    extraction = await _run(ai_service.extract_decision, body.message)

    # Step 2: run 4 calls in parallel
    belief_graph, assumptions, contradictions, scenarios = await asyncio.gather(
      _run(ai_service.generate_belief_graph, extraction),
      _run(ai_service.stress_test_assumptions, extraction),
      _run(ai_service.detect_contradictions, extraction),
      _run(ai_service.generate_scenarios, extraction),
    )

    # Step 3: final two in parallel
    tradeoffs, questions = await asyncio.gather(
      _run(ai_service.analyze_tradeoffs, scenarios),
      _run(ai_service.generate_reflection_questions, extraction, assumptions, contradictions),
    )

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
    contract = await _run(
      ai_service.generate_decision_contract,
      body.decision,
      body.analysis.assumptions,
      body.analysis.scenarios,
    )
    return contract
  except Exception as e:
    raise HTTPException(status_code=500, detail=str(e))


@router.post("/action-plan", response_model=ActionPlan)
async def generate_action_plan(body: ActionPlanRequest):
  try:
    plan = await _run(ai_service.generate_action_plan, body.decision, body.extraction)
    return plan
  except Exception as e:
    raise HTTPException(status_code=500, detail=str(e))
