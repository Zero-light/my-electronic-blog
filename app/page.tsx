import { getAllNotes, getAllProjects, sortByDate } from '@/lib/mdx';
import { HomePageClient } from './home-page-client';

export default function Page() {
  const notes = sortByDate(getAllNotes());
  const projects = sortByDate(getAllProjects());

  return <HomePageClient notes={notes} projects={projects} />;
}
