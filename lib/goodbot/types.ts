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
export type ApprovalStatus = "pending" | "approved" | "rejected";
export type DistributionStatus = "not_ready" | "ready" | "distributed" | "failed";
export type DistributionEventStatus = "claimed" | "verified" | "failed";
export type LandingPageVariantStatus = "draft" | "active" | "archived";
export type RecommendationConfidence = "low" | "medium" | "high";
export type RecommendationStatus = "pending" | "approved" | "running" | "rejected" | "executed" | "failed";
export type JobStatus = "pending" | "running" | "completed" | "failed";

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

export type ContentAssetRecord = {
  id: string;
  goal_id: string;
  created_at: string;
  content_type: "linkedin_post" | "blog_post" | "email_draft";
  status: "draft" | "published" | "ready_to_publish";
  title: string | null;
  body: string;
  edited_body: string | null;
  channel: string;
  published_url: string | null;
  approval_status: ApprovalStatus;
  approved_at: string | null;
  rejected_at: string | null;
  distribution_status: DistributionStatus;
  distributed_at: string | null;
  distribution_channel: string | null;
  recommended_action: string | null;
  metadata: Record<string, unknown>;
};

export type LandingPageRecord = {
  id: string;
  goal_id: string;
  created_at: string;
  slug: string;
  headline: string;
  subheadline: string;
  cta: string;
  bullets: string[];
  status: string;
  version: number;
  approval_status: ApprovalStatus;
  approved_at: string | null;
  rejected_at: string | null;
  distribution_status: DistributionStatus;
  distributed_at: string | null;
  distribution_channel: string | null;
  recommended_action: string | null;
};

export type LandingPageVariantRecord = {
  id: string;
  goal_id: string;
  landing_page_id: string;
  variant_name: string;
  headline: string;
  subheadline: string;
  cta: string;
  bullets: string[];
  status: LandingPageVariantStatus;
  reason: string | null;
  created_at: string;
};

export type DistributionEventRecord = {
  id: string;
  goal_id: string;
  content_asset_id: string | null;
  landing_page_id: string | null;
  channel: string;
  status: DistributionEventStatus;
  claimed_url: string | null;
  tracking_url: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  verified_at: string | null;
  created_at: string;
  metadata: Record<string, unknown>;
};

export type GoodBotJobRecord = {
  id: string;
  goal_id: string;
  step_id: string | null;
  recommendation_id?: string | null;
  job_type: string;
  status: JobStatus;
  attempts: number;
  max_attempts: number;
  run_after: string;
  locked_at: string | null;
  error: string | null;
  input: Record<string, unknown>;
  output: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
};

export type RecommendationRecord = {
  id: string;
  goal_id: string;
  recommendation_type: string;
  title: string;
  rationale: string;
  confidence: RecommendationConfidence;
  status: RecommendationStatus;
  input: Record<string, unknown>;
  output: Record<string, unknown>;
  created_at: string;
  executed_at: string | null;
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
  is_demo?: boolean;
  access_token_hash?: string | null;
  status: "working" | "paused" | "completed" | "failed";
};

export type StepOutput = {
  ok: boolean;
  summary: string;
  artifacts?: Record<string, unknown>;
};
