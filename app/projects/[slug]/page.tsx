import { notFound } from "next/navigation";
import { allProjects } from "contentlayer/generated";
import { Mdx } from "@/app/components/mdx";

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = allProjects.find((project) => project.slug === params.slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="bg-zinc-50 min-h-screen">
      <article className="max-w-2xl px-6 py-24 mx-auto space-y-8">
        <div className="space-y-6">
          <h1 className="text-3xl font-bold md:text-4xl">{project.title}</h1>
          <p className="text-zinc-600">{project.description}</p>
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
