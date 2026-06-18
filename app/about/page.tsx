import { Mail, Github, MapPin, GraduationCap, Briefcase, Target, Phone } from 'lucide-react';
import { Timeline } from '@/components/timeline';
import { SkillBar } from '@/components/skill-bar';
import { profile } from '@/content/data/profile';
import { skillCategories } from '@/content/data/skills';

export default function AboutPage() {
  const educationItems = profile.education.map((edu) => ({
    date: edu.period,
    title: `${edu.school} · ${edu.major}`,
    subtitle: edu.degree,
    description: edu.description,
  }));

  const experienceItems = profile.experience.map((exp) => ({
    date: exp.period,
    title: exp.role,
    subtitle: exp.company,
    description: exp.description,
  }));

  return (
    <div className="animate-fade-in space-y-16">
      {/* 个人简介 */}
      <section className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          关于我
        </h1>
        <p className="max-w-3xl leading-relaxed text-slate-600 dark:text-slate-400">
          {profile.summary}
        </p>

        <div className="flex flex-wrap gap-4 text-sm text-text-muted">
          <a
            href={`mailto:${profile.email}`}
            className="inline-flex items-center gap-1 transition-colors hover:text-primary"
          >
            <Mail className="h-4 w-4" />
            {profile.email}
          </a>
          <span className="inline-flex items-center gap-1">
            <Phone className="h-4 w-4" />
            {profile.phone}
          </span>
          {profile.github && (
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 transition-colors hover:text-primary"
            >
              <Github className="h-4 w-4" />
              GitHub
            </a>
          )}
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {profile.location}
          </span>
        </div>
      </section>

      {/* 求职意向 */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-slate-100">
          <Target className="h-5 w-5 text-primary" />
          求职意向
        </div>
        <div className="rounded-xl border border-border bg-bg-soft p-5">
          <p className="text-slate-700 dark:text-slate-300">{profile.objective}</p>
        </div>
      </section>

      {/* 教育经历 */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-slate-100">
          <GraduationCap className="h-5 w-5 text-primary" />
          教育经历
        </div>
        <Timeline items={educationItems} />
      </section>

      {/* 项目经历 */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-slate-100">
          <Briefcase className="h-5 w-5 text-primary" />
          项目经历
        </div>
        <Timeline items={experienceItems} />
      </section>

      {/* 技能汇总 */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-slate-100">
          专业技能
        </div>
        <SkillBar categories={skillCategories} />
      </section>

      {/* 荣誉证书 */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-slate-100">
          荣誉证书
        </div>
        <ul className="grid gap-2 sm:grid-cols-2">
          {profile.honors.map((honor) => (
            <li
              key={honor}
              className="flex items-center gap-2 rounded-lg border border-border bg-bg-soft px-4 py-2 text-sm text-slate-700 dark:text-slate-300"
            >
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              {honor}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
