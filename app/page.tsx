import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { SkillBar } from '@/components/skill-bar';
import { getAllNotes, getAllProjects, sortByDate } from '@/lib/mdx';
import { formatDate } from '@/lib/utils';
import { skillCategories } from '@/content/data/skills';
import {
  ArrowRight,
  BookOpen,
  Coffee,
  FileText,
  FolderGit2,
  Wrench,
} from 'lucide-react';
import Link from 'next/link';

/* ============================================================
   页面
   ============================================================ */

export default function HomePage() {
  const notes = sortByDate(getAllNotes());
  const projects = sortByDate(getAllProjects());
  const latestNotes = notes.slice(0, 3);
  const latestProject = projects[0];

  return (
    <div className="animate-fade-in space-y-16">
      {/* ----------------------------------------------------------
         Banner 区域
         ---------------------------------------------------------- */}
      <section className="flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
        {/* 头像占位（CSS 首字母） */}
        <div
          className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full text-3xl font-bold text-white"
          style={{ backgroundColor: 'var(--primary)' }}
        >
          E
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            你好，我是 <span className="text-primary">EIE 工程师</span>
          </h1>
          <p className="text-sm font-medium text-sky-600 dark:text-sky-400">
            电子信息工程 · 嵌入式系统与电源设计方向
          </p>
          <p className="max-w-2xl leading-relaxed text-slate-600 dark:text-slate-400">
            热爱从晶体管到系统的全栈硬件开发，专注于高效开关电源、精密信号链与嵌入式固件设计。
            这里是我在学习与工程实践中的知识沉淀、项目复盘与生活记录。
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
            <Link href="/resume/" className="btn-primary">
              下载简历
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/projects/" className="btn-ghost">
              查看作品
            </Link>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------
         三大功能快捷入口
         ---------------------------------------------------------- */}
      <section>
        <h2 className="mb-6 text-xl font-bold text-slate-900 dark:text-slate-100">
          探索
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link href="/notes/">
            <Card hover className="h-full">
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400">
                  <BookOpen className="h-5 w-5" />
                </div>
                <CardTitle>知识库</CardTitle>
                <CardDescription>
                  嵌入式笔记、电源设计复盘、模电数电与工具教程
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/projects/">
            <Card hover className="h-full">
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400">
                  <Wrench className="h-5 w-5" />
                </div>
                <CardTitle>作品集</CardTitle>
                <CardDescription>
                  硬件项目全流程展示：需求 → 架构 → PCB → 固件 → 测试
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/life/">
            <Card hover className="h-full">
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400">
                  <Coffee className="h-5 w-5" />
                </div>
                <CardTitle>生活记录</CardTitle>
                <CardDescription>
                  随笔日记、相册图库与爱好分享
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </section>

      {/* ----------------------------------------------------------
         技能可视化
         ---------------------------------------------------------- */}
      <section>
        <h2 className="mb-6 text-xl font-bold text-slate-900 dark:text-slate-100">
          专业技能
        </h2>
        <SkillBar categories={skillCategories} />
      </section>

      {/* ----------------------------------------------------------
         最新动态
         ---------------------------------------------------------- */}
      <section>
        <h2 className="mb-6 text-xl font-bold text-slate-900 dark:text-slate-100">
          最新动态
        </h2>
        <div className="space-y-4">
          {/* 最新项目 */}
          {latestProject && (
            <Card hover>
              <CardHeader>
                <div className="flex items-center gap-2 text-sm font-medium text-sky-600 dark:text-sky-400">
                  <FolderGit2 className="h-4 w-4" />
                  <span>最新项目</span>
                </div>
                <CardTitle className="mt-2">
                  <Link
                    href={`/projects/${latestProject.slug}/`}
                    className="transition-colors hover:text-primary"
                  >
                    {latestProject.title}
                  </Link>
                </CardTitle>
                <CardDescription>
                  {latestProject.description || '暂无描述'}
                </CardDescription>
              </CardHeader>
            </Card>
          )}

          {/* 最新笔记 */}
          {latestNotes.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {latestNotes.map((note) => (
                <Card key={note.slug} hover className="h-full">
                  <CardHeader>
                    <div className="flex items-center gap-2 text-sm font-medium text-sky-600 dark:text-sky-400">
                      <FileText className="h-4 w-4" />
                      <span>{formatDate(note.date)}</span>
                    </div>
                    <CardTitle className="mt-2 text-base">
                      <Link
                        href={`/notes/${note.slug}/`}
                        className="transition-colors hover:text-primary"
                      >
                        {note.title}
                      </Link>
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {note.description || '暂无描述'}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              暂无笔记，精彩内容即将上线。
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
