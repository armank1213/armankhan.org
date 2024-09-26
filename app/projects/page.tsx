import Link from "next/link";
import React from "react";
import { allProjects, Project } from "contentlayer/generated";
import { Navigation } from "../components/nav";
import { Article } from "./article";
import { Redis } from "@upstash/redis";
import { Eye } from "lucide-react";
import { Card } from "../components/card";
import { CardContent } from "../components/card-content";

const redis = Redis.fromEnv();

// Change this line to force revalidation on every request
export const revalidate = 0;

export default async function ProjectsPage() {
  console.log("All projects:", allProjects);

  const views = (
    await redis.mget<number[]>(
      ...allProjects.map((p) => ["pageviews", "projects", p.slug].join(":")),
    )
  ).reduce((acc, v, i) => {
    acc[allProjects[i].slug] = v ?? 0;
    return acc;
  }, {} as Record<string, number>);

  const sorted = allProjects
    .filter((p: Project) => {
      console.log(`Project ${p.slug}: published = ${p.published}`);
      return p.published;
    })
    .sort((a: Project, b: Project) => {
      const dateA = b.date ? new Date(b.date).getTime() : 0;
      const dateB = a.date ? new Date(a.date).getTime() : 0;
      return dateA - dateB;
    });

  console.log("Sorted projects:", sorted.map((p: Project) => p.slug));

  return (
    <div className="relative pb-16">
      <Navigation />
      <div className="px-6 pt-20 mx-auto space-y-8 max-w-7xl lg:px-8 md:space-y-16 md:pt-24 lg:pt-32">
        <div className="max-w-2xl mx-auto lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
            Projects
          </h2>
          <p className="mt-4 text-zinc-400">
            Some of the projects are from work and some are on my own time.
          </p>
        </div>
        <div className="w-full h-px bg-zinc-800" />

        <div className="hidden w-full h-px md:block bg-zinc-800" />

        <div className="grid grid-cols-1 gap-4 mx-auto lg:mx-0 md:grid-cols-3">
          <div className="grid grid-cols-1 gap-4">
            {sorted
              .filter((_, i) => i % 3 === 0)
              .map((project: Project) => (
                <Card key={project.slug}>
                  <CardContent>
                    <Article project={project} views={views[project.slug] ?? 0} />
                  </CardContent>
                </Card>
              ))}
          </div>
          <div className="grid grid-cols-1 gap-4">
            {sorted
              .filter((_, i) => i % 3 === 1)
              .map((project: Project) => (
                <Card key={project.slug}>
                  <CardContent>
                    <Article project={project} views={views[project.slug] ?? 0} />
                  </CardContent>
                </Card>
              ))}
          </div>
          <div className="grid grid-cols-1 gap-4">
            {sorted
              .filter((_, i) => i % 3 === 2)
              .map((project: Project) => (
                <Card key={project.slug}>
                  <CardContent>
                    <Article project={project} views={views[project.slug] ?? 0} />
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
