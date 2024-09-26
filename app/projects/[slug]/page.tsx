import { notFound } from "next/navigation";
import { allProjects } from "contentlayer/generated";
import { Mdx } from "@/app/components/mdx";
import { Redis } from "@upstash/redis";
import { Eye } from "lucide-react";

const redis = Redis.fromEnv();

export const revalidate = 0;

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const project = allProjects.find((project) => project.slug === params.slug);

  if (!project) {
    notFound();
  }

  const views = await redis.incr(["pageviews", "projects", params.slug].join(":"));

  return (
    <div className="bg-zinc-50 min-h-screen">
      <article className="max-w-2xl px-6 py-24 mx-auto space-y-8">
        <div className="space-y-6">
          <h1 className="text-3xl font-bold md:text-4xl">{project.title}</h1>
          <p className="text-zinc-600">{project.description}</p>
          <div className="flex items-center text-zinc-500 text-sm">
            <Eye className="w-4 h-4 mr-1" />
            {Intl.NumberFormat("en-US", { notation: "compact" }).format(views)} views
          </div>
        </div>
        {project.body.code ? (
          <Mdx code={project.body.code} />
        ) : (
          <p>Error: No MDX content available</p>
        )}
      </article>
    </div>
  );
}

export async function generateStaticParams() {
  return allProjects.map((project) => ({
    slug: project.slug,
  }));
}
