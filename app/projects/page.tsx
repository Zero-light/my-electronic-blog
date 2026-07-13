import { getAllProjects, sortByDate } from '@/lib/mdx';
import { ProjectsList } from '@/components/projects-list';

export default function ProjectsPage() {
  const projects = sortByDate(getAllProjects());
  const allTags = [...new Set(projects.flatMap((p) => p.tags))];

  return (
    <div className="animate-fade-in space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          项目作品
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          嵌入式 · 硬件 · Vibe coding — 项目全流程展示：需求分析 → 架构设计 → 开发实现 → 调试验证。
        </p>
      </div>
      <ProjectsList projects={projects} allTags={allTags} />
    </div>
  );
}
