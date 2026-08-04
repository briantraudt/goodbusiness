import test from "node:test";
import assert from "node:assert/strict";
import { getMarketSession, isRecommendationWindow, scoreCandidate } from "../lib/social-arb-signal.js";

test("normal summer session recommends at 2:45 PM Central", () => {
  const session = getMarketSession(new Date("2026-08-04T19:45:00Z"));
  assert.equal(session.isTradingDay, true);
  assert.equal(session.recommendationLabel, "2:45 PM CT");
  assert.equal(session.closeLabel, "3:00 PM CT");
  assert.equal(isRecommendationWindow(new Date("2026-08-04T19:45:00Z"), 0), true);
});

test("winter DST conversion still recommends at 2:45 PM Central", () => {
  assert.equal(isRecommendationWindow(new Date("2026-12-08T20:45:00Z"), 0), true);
});

test("market holidays and weekends do not run", () => {
  assert.equal(getMarketSession(new Date("2026-12-25T18:45:00Z")).isTradingDay, false);
  assert.equal(getMarketSession(new Date("2026-08-08T19:45:00Z")).isTradingDay, false);
});

test("day after Thanksgiving uses the 11:45 AM Central early-close window", () => {
  const session = getMarketSession(new Date("2026-11-27T17:45:00Z"));
  assert.equal(session.earlyClose, true);
  assert.equal(session.recommendationLabel, "11:45 AM CT");
  assert.equal(isRecommendationWindow(new Date("2026-11-27T17:45:00Z"), 0), true);
});

test("strong corroborated setup qualifies while thin single-source chatter abstains", () => {
  const market = { ticker: "NVDA", price: 190, dayChangePct: 1.4, lateMomentumPct: 0.8, fromOpenPct: 1.2, dayRangePct: 2.5, relativeVolume: 1.7, dollarVolume: 2_000_000_000 };
  const strong = scoreCandidate(market, { sentiment: 0.55, acceleration: 2.8, sourceCount: 4, mentions24h: 18, catalystCount: 2, evidence: [] });
  const weak = scoreCandidate(market, { sentiment: 0.2, acceleration: 1, sourceCount: 1, mentions24h: 1, catalystCount: 0, evidence: [] });
  assert.equal(strong.qualified, true);
  assert.ok(strong.score >= 62);
  assert.equal(weak.qualified, false);
  assert.ok(weak.riskFlags.includes("single-source concentration"));
});
