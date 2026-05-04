import { notFound } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/goodbot/supabase";
import LandingTracker from "./LandingTracker";
import SignupForm from "./SignupForm";

export const dynamic = "force-dynamic";

export default async function GeneratedLandingPage({ params }: { params: Promise<{ goalId: string }> }) {
  const { goalId } = await params;
  const supabase = getSupabaseAdmin();
  const [{ data: goal }, { data: page }, { data: blogPosts }] = await Promise.all([
    supabase.from("goals").select("*").eq("id", goalId).single(),
    supabase.from("landing_pages").select("*").eq("goal_id", goalId).order("created_at", { ascending: false }).limit(1).maybeSingle(),
    supabase
      .from("content_assets")
      .select("id,title")
      .eq("goal_id", goalId)
      .eq("content_type", "blog_post")
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(2)
  ]);

  if (!goal || !page) notFound();
  const { data: activeVariant } = await supabase
    .from("landing_page_variants")
    .select("*")
    .eq("landing_page_id", page.id)
    .eq("status", "active")
    .limit(1)
    .maybeSingle();

  const visiblePage = activeVariant || page;
  const bullets = Array.isArray(visiblePage.bullets) ? visiblePage.bullets : [];

  return (
    <main className="generated-page">
      <LandingTracker goalId={goalId} variantId={activeVariant?.id ?? null} />
      <section className="generated-hero">
        <p className="eyebrow">{goal.app_name || "GoodBot launch"}</p>
        <h1>{visiblePage.headline}</h1>
        <p>{visiblePage.subheadline}</p>
        <SignupForm goalId={goalId} cta={visiblePage.cta} variantId={activeVariant?.id ?? null} />
      </section>
      <section className="proof-band">
        {bullets.map((bullet: string) => (
          <article key={bullet}>
            <span />
            <h2>{bullet}</h2>
          </article>
        ))}
      </section>
      {blogPosts?.length ? (
        <section className="blog-band">
          {blogPosts.map((post) => (
            <a key={post.id} href={`/goodbot/blog/${post.id}`}>
              {post.title}
            </a>
          ))}
        </section>
      ) : null}
    </main>
  );
}
