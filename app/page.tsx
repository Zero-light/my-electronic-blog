import { getAllNotes, getAllProjects, sortByDate } from '@/lib/mdx';
import { HomePage } from '@/components/home-page';

export default function Page() {
  const notes = sortByDate(getAllNotes());
  const projects = sortByDate(getAllProjects());

  return <HomePage notes={notes} projects={projects} />;
}
