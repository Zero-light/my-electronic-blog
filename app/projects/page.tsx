import { getAllProjects, sortByDate } from '@/lib/mdx';
import { ProjectsListClient } from './projects-list-client';

const CATEGORIES = ['嵌入式', '硬件', 'Vibe coding'];

export default function ProjectsPage() {
  const projects = sortByDate(getAllProjects());

  return (
    <div className="animate-fade-in space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          项目作品
        </h1>
      </div>
      <ProjectsListClient projects={projects} categories={CATEGORIES} />
    </div>
  );
}
