# GoodBot V1: Autonomous Outcome Engine

## Scope

GoodBot V1 supports one domain: user acquisition for a web app.

It supports four executable functions:

- `createLandingPage()`
- `generateContent()`
- `publishContent()`
- `trackMetrics()`

It does not support browser automation, scraping, Zapier-style integrations, generalized agents, paid ads, or multiple goals.

## Architecture Diagram

```text
goodbusinesshq.com/goodbot
        |
        v
Goal Intake UI
        |
        v
POST /api/goodbot/goals
        |
        +--> parseGoal()
        +--> goals insert
        +--> Planning Engine (LLM JSON, deterministic fallback)
        |        |
        |        v
        |     plans + steps insert
        |
        v
Execution Engine
        |
        +--> create_landing_page  --> landing_pages row --> /goodbot/landing/[goalId]
        +--> generate_content      --> content_assets rows
        +--> publish_content       --> blog posts published, LinkedIn posts ready_to_publish
        +--> track_metrics         --> visit/signup endpoints active
        |
        v
State + Memory in Supabase
        |
        +--> goals
        +--> plans
        +--> steps
        +--> executions
        +--> metrics
        +--> leads
        +--> landing_pages
        +--> content_assets
        +--> notifications
        |
        v
Vercel Cron: /api/cron/goodbot-feedback
        |
        v
Feedback Loop
        |
        +--> progressing: continue
        +--> not progressing: generate sharper content + notify strategy changed
        +--> target reached: mark completed + notify
```

## Database Schema

Supabase SQL is in `supabase/goodbot-v1.sql`.

The V1 tables requested by the product spec are present:

- `goals`
- `plans`
- `steps`
- `executions`
- `metrics`

Additional V1 execution tables:

- `leads` for email capture
- `landing_pages` for generated hosted pages
- `content_assets` for LinkedIn/blog content
- `notifications` for milestone/strategy/complete updates

## Prompt Templates

Prompt templates live in `lib/goodbot/prompts.ts`.

- Goal to plan: `goalToPlanPrompt()`
- Landing page execution: `landingPagePrompt()`
- Content execution: `contentPrompt()`
- Feedback loop decision: `feedbackPrompt()`

Every prompt repeats the V1 scope and allowed step types so the model cannot drift into a general agent plan.

## Minimal UI Wireframe

```text
/goodbot

[Good Business / GoodBot]
Autonomous Outcome Engine
One goal goes in...

---------------------------------------------------------
| What do you want to achieve? | Status                 |
| [Get 50 users for my app   ] | Working...             |
| [App name] [Audience]        | Visits / Users / Target|
| [Start GoodBot]              | Actions completed      |
---------------------------------------------------------

No dashboard. No task manager. The status panel only shows meaningful execution progress.
```

```text
/goodbot/landing/[goalId]

[Generated app name]
[Generated headline]
[Generated subheadline]
[Name] [Email] [CTA]

[Benefit 1] [Benefit 2] [Benefit 3]
[Generated blog links]
```

## End-to-End Flow

Input:

```text
Get 50 users for my app
```

Structured goal:

```json
{
  "goal": "Get 50 users for my app",
  "target_metric": "users",
  "target_value": 50,
  "timeframe": null
}
```

Plan:

```json
[
  { "step_type": "create_landing_page", "title": "Create acquisition landing page", "status": "pending" },
  { "step_type": "generate_content", "title": "Generate 5 LinkedIn posts and 2 blog posts", "status": "pending" },
  { "step_type": "publish_content", "title": "Publish GoodBot-hosted content and prepare LinkedIn posts", "status": "pending" },
  { "step_type": "track_metrics", "title": "Track visits and signups", "status": "pending" }
]
```

Execution result:

```text
Landing page published at /goodbot/landing/[goalId]
2 blog posts published at /goodbot/blog/[assetId]
5 LinkedIn posts marked ready_to_publish
Visits and signups recorded in metrics
Emails stored in leads
Daily cron evaluates whether signups are moving toward 50
```

User-visible return state:

```text
Users acquired: 23
Actions taken: landing page generated, 7 content assets created, blog content published
Status: Working. The loop is live and GoodBot is watching for progress.
```
