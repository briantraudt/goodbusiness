import { notFound } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/goodbot/supabase";

export const dynamic = "force-dynamic";

export default async function BlogPostPage({ params }: { params: Promise<{ assetId: string }> }) {
  const { assetId } = await params;
  const supabase = getSupabaseAdmin();
  const { data: post } = await supabase
    .from("content_assets")
    .select("id,goal_id,title,body,status")
    .eq("id", assetId)
    .eq("content_type", "blog_post")
    .single();

  if (!post || post.status !== "published") notFound();

  return (
    <main className="blog-post">
      <a href={`/goodbot/landing/${post.goal_id}`}>Back to landing page</a>
      <h1>{post.title}</h1>
      <article>
        {String(post.body)
          .split(/\n{2,}/)
          .map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
      </article>
    </main>
  );
}
