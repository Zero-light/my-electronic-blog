import { getAllProjects, sortByDate } from '@/lib/mdx';
import { ProjectsList } from '@/components/projects-list';

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
      <ProjectsList projects={projects} categories={CATEGORIES} />
    </div>
  );
}
