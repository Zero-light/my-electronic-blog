import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { HeroGlow } from '@/components/hero-glow';
import { getAllNotes, getAllProjects, sortByDate } from '@/lib/mdx';
import { formatDate } from '@/lib/utils';
import {
  ArrowRight,
  BookOpen,
  FileText,
  FolderGit2,
  Wrench,
  Cpu,
  CircuitBoard,
  GraduationCap,
} from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const notes = sortByDate(getAllNotes());
  const projects = sortByDate(getAllProjects());
  const latestNotes = notes.slice(0, 3);
  const latestProject = projects[0];

  return (
    <div className="animate-fade-in space-y-16">
      {/* Hero */}
      <HeroGlow className="rounded-2xl border border-border/30 py-10 md:py-12">
        <div className="space-y-5 md:space-y-6">
          <h1 className="text-[2.5rem] font-bold leading-tight tracking-tight text-slate-900 dark:text-slate-100">
            你好，我是{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: 'linear-gradient(135deg, var(--primary), var(--accent))',
              }}
            >
              任炳宇
            </span>
          </h1>
          <p className="text-sm font-medium" style={{ color: 'var(--primary)' }}>
            电子信息工程 · 嵌入式系统与电源设计方向
          </p>
          <p className="max-w-xl text-[0.92rem] leading-relaxed text-slate-600 dark:text-[#8b949e]">
            具备软硬件一体化开发能力的嵌入式工程师，专注于 STM32 嵌入式固件、高效电源闭环控制与精密信号链设计。
            这里是我在学习与工程实践中的知识沉淀与项目复盘。
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
      </HeroGlow>

      {/* 方向标签 */}
      <section className="flex flex-wrap items-center justify-center gap-2.5 md:justify-start">
        {[
          { icon: <Cpu className="h-3.5 w-3.5" />, text: '嵌入式固件' },
          { icon: <CircuitBoard className="h-3.5 w-3.5" />, text: '硬件与电源设计' },
          { icon: <BookOpen className="h-3.5 w-3.5" />, text: 'PCB 与信号完整性' },
          { icon: <GraduationCap className="h-3.5 w-3.5" />, text: '学习笔记与复盘' },
        ].map((item) => (
          <span
            key={item.text}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-bg-soft/80 px-3.5 py-1.5 text-xs font-medium text-text-muted transition-colors hover:border-primary/20 hover:text-primary"
          >
            {item.icon}
            {item.text}
          </span>
        ))}
      </section>

      {/* 最新项目 */}
      {latestProject && (
        <section>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              最新项目
            </h2>
            <Link
              href="/projects/"
              className="text-sm text-text-muted transition-colors hover:text-primary"
            >
              查看全部 →
            </Link>
          </div>
          <Card hover>
            <CardHeader>
              <div className="flex items-center gap-2 text-sm font-medium" style={{ color: 'var(--primary)' }}>
                <FolderGit2 className="h-4 w-4" />
                <span>{formatDate(latestProject.date)}</span>
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
        </section>
      )}

      {/* 学习笔记 */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            学习笔记
          </h2>
          <Link
            href="/notes/"
            className="text-sm text-text-muted transition-colors hover:text-primary"
          >
            查看全部 →
          </Link>
        </div>
        {latestNotes.length > 0 ? (
          <div className="stagger-container grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {latestNotes.map((note) => (
              <Card key={note.slug} hover className="stagger-item h-full">
                <CardHeader>
                  <div className="flex items-center gap-2 text-sm font-medium" style={{ color: 'var(--primary)' }}>
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
      </section>

      {/* 关于本站 */}
      <section className="rounded-xl border border-border/50 bg-bg-soft/50 p-6 text-center backdrop-sm">
        <p className="text-sm leading-relaxed text-text-muted">
          本站记录了我在嵌入式开发、电源设计与硬件调试中的学习笔记和项目实践。
          所有内容仅供学习交流，转载请注明出处。
        </p>
        <div className="mt-4 flex items-center justify-center gap-4">
          <Link
            href="/notes/"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary-dark"
          >
            <BookOpen className="h-4 w-4" />
            浏览笔记
          </Link>
          <Link
            href="/resume/"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary-dark"
          >
            <ArrowRight className="h-4 w-4" />
            查看简历
          </Link>
        </div>
      </section>
    </div>
  );
}
