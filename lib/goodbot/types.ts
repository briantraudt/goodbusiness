export type GoalObject = {
  goal: string;
  target_metric: "users";
  target_value: number;
  timeframe?: string | null;
  app_name?: string | null;
  audience?: string | null;
  positioning?: string | null;
};

export type StepType = "create_landing_page" | "generate_content" | "publish_content" | "track_metrics";
export type StepStatus = "pending" | "running" | "completed" | "failed" | "skipped";

export type PlanStep = {
  step_type: StepType;
  title: string;
  input: Record<string, unknown>;
};

export type ExecutionPlan = {
  rationale: string;
  steps: PlanStep[];
};

export type StepRecord = {
  id: string;
  goal_id: string;
  plan_id: string;
  position: number;
  step_type: StepType;
  title: string;
  status: StepStatus;
  input: Record<string, unknown>;
  output: Record<string, unknown> | null;
  error: string | null;
};

export type GoalRecord = {
  id: string;
  goal: string;
  target_metric: "users";
  target_value: number;
  timeframe: string | null;
  app_name: string | null;
  audience: string | null;
  positioning: string | null;
  status: "working" | "paused" | "completed" | "failed";
};

export type StepOutput = {
  ok: boolean;
  summary: string;
  artifacts?: Record<string, unknown>;
};
