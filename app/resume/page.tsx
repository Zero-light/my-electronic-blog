import { Mail, Github, MapPin, GraduationCap, Briefcase, Target, Phone, Award } from 'lucide-react';
import { Timeline } from '@/components/timeline';
import { SkillBar } from '@/components/skill-bar';
import { ResumeActions } from '@/components/resume-actions';
import { profile } from '@/content/data/profile';
import { skillCategories } from '@/content/data/skills';

export default function ResumePage() {
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
    <div className="animate-fade-in space-y-12">
      {/* 操作栏（打印时隐藏） */}
      <ResumeActions />

      {/* 简历内容 */}
      <div className="space-y-10 print:text-black">
        {/* 头部信息 */}
        <header className="space-y-3 border-b border-border pb-6 print:border-gray-300">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 print:text-black">
            {profile.name}
          </h1>
          <p className="text-primary font-medium">{profile.title}</p>
          <div className="flex flex-wrap gap-4 text-sm text-text-muted print:text-gray-600">
            <span className="inline-flex items-center gap-1">
              <Phone className="h-4 w-4" />
              {profile.phone}
            </span>
            <span className="inline-flex items-center gap-1">
              <Mail className="h-4 w-4" />
              {profile.email}
            </span>
            {profile.github && (
              <span className="inline-flex items-center gap-1">
                <Github className="h-4 w-4" />
                {profile.github.replace('https://', '')}
              </span>
            )}
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {profile.location}
            </span>
          </div>
        </header>

        {/* 求职意向 */}
        <section className="space-y-2">
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-slate-100 print:text-black">
            <Target className="h-4 w-4 text-primary" />
            求职意向
          </h2>
          <p className="leading-relaxed text-slate-700 dark:text-slate-300 print:text-gray-800">
            {profile.objective}
          </p>
        </section>

        {/* 教育经历 */}
        <section className="space-y-3">
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-slate-100 print:text-black">
            <GraduationCap className="h-4 w-4 text-primary" />
            教育经历
          </h2>
          <Timeline items={educationItems} />
        </section>

        {/* 项目经历 */}
        <section className="space-y-3">
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-slate-100 print:text-black">
            <Briefcase className="h-4 w-4 text-primary" />
            项目经历
          </h2>
          <Timeline items={experienceItems} />
        </section>

        {/* 技能 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 print:text-black">
            专业技能
          </h2>
          <SkillBar categories={skillCategories} />
        </section>

        {/* 荣誉证书 */}
        <section className="space-y-3">
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-slate-100 print:text-black">
            <Award className="h-4 w-4 text-primary" />
            荣誉证书
          </h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {profile.honors.map((honor) => (
              <div
                key={honor}
                className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 print:text-gray-800"
              >
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {honor}
              </div>
            ))}
          </div>
        </section>

        {/* 自我评价 */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 print:text-black">
            自我评价
          </h2>
          <p className="leading-relaxed text-slate-700 dark:text-slate-300 print:text-gray-800">
            {profile.summary}
          </p>
        </section>
      </div>
    </div>
  );
}
