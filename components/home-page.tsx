'use client';

import { useState, useMemo } from 'react';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { HeroGlow } from '@/components/hero-glow';
import { ProjectCard } from '@/components/project-card';
import { NoteCard } from '@/components/note-card';
import { NoteMeta, ProjectMeta } from '@/lib/mdx';
import { ArrowRight, BookOpen, FolderGit2, FileText } from 'lucide-react';
import Link from 'next/link';

interface HomePageProps {
  notes: NoteMeta[];
  projects: ProjectMeta[];
}

const FILTERS = [
  { key: 'all', label: '全部' },
  { key: 'embedded', label: '嵌入式固件' },
  { key: 'hardware', label: '硬件与电源' },
  { key: 'pcb', label: 'PCB & 信号完整性' },
  { key: 'notes', label: '学习笔记' },
] as const;

type FilterKey = (typeof FILTERS)[number]['key'];

function matchesFilter(item: NoteMeta | ProjectMeta, filter: FilterKey): boolean {
  if (filter === 'all') return true;
  const tags = [...item.tags];
  if ('mainCategory' in item && item.mainCategory) tags.push(item.mainCategory);
  if ('subCategory' in item && item.subCategory) tags.push(item.subCategory);
  const allText = tags.join(' ').toLowerCase();
  switch (filter) {
    case 'embedded':
      return allText.includes('嵌入式') || allText.includes('stm32') || allText.includes('rtos') || allText.includes('固件');
    case 'hardware':
      return allText.includes('电源') || allText.includes('硬件') || allText.includes('电路') || allText.includes('pcb');
    case 'pcb':
      return allText.includes('pcb') || allText.includes('信号') || allText.includes('完整性') || allText.includes('阻抗') || allText.includes('布线') || allText.includes('覆铜');
    case 'notes':
      return allText.includes('嵌入式') || allText.includes('硬件') || allText.includes('c语言') || allText.includes('c 语言') || allText.includes('面试') || allText.includes('rtos');
    default:
      return true;
  }
}

export function HomePage({ notes, projects }: HomePageProps) {
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');

  const filteredProjects = useMemo(
    () => projects.filter((p) => matchesFilter(p, activeFilter)),
    [projects, activeFilter]
  );

  const filteredNotes = useMemo(
    () => notes.filter((n) => matchesFilter(n, activeFilter)),
    [notes, activeFilter]
  );

  const showProjects = filteredProjects.length > 0 && activeFilter !== 'notes';
  const showNotes = filteredNotes.length > 0 && activeFilter !== 'hardware' && activeFilter !== 'pcb';

  return (
    <div className="animate-fade-in space-y-12">
      {/* Hero */}
      <HeroGlow className="hero-pattern rounded-2xl border border-border/30 py-8 text-center md:py-10">
        <div className="mx-auto max-w-2xl space-y-4 px-4">
          <img
            src="/images/avatar.webp"
            alt="任炳宇"
            className="hero-avatar mx-auto h-24 w-24 rounded-full object-cover"
          />
          <h1 className="text-[2.2rem] font-bold leading-tight tracking-tight text-slate-900 dark:text-slate-100">
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
          <p className="text-sm font-semibold tracking-wide" style={{ color: 'var(--primary)' }}>
            电子信息工程 ｜ 嵌入式系统 &amp; 电源设计方向
          </p>
          <ul className="mx-auto max-w-lg space-y-1 text-left text-[0.82rem] leading-relaxed text-slate-600 dark:text-[#8b949e]">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 shrink-0 text-green-500">✅</span>
              <span><strong className="keyword-highlight">STM32</strong> 全栈固件开发：F1/H7/L0、<strong className="keyword-highlight">RTOS</strong>、DMA/ADC/SPI 外设驱动</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 shrink-0 text-green-500">✅</span>
              <span>硬件电源设计：DCDC/LDO 环路、TL431 反馈、硬件调试</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 shrink-0 text-green-500">✅</span>
              <span><strong className="keyword-highlight">PCB</strong> 信号完整性：Layout、阻抗计算、趋肤效应、EMC 仿真</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 shrink-0 text-green-500">✅</span>
              <span>上位机开发：<strong className="keyword-highlight">PyQt6</strong> 波形发生器、串口数据交互、Excel 数据处理</span>
            </li>
          </ul>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            <Link href="/resume/" className="btn-primary">
              下载简历
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/projects/" className="btn-outline">
              查看全部项目
            </Link>
          </div>
        </div>
      </HeroGlow>

      {/* 筛选标签 */}
      <section className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setActiveFilter(f.key)}
            className={`filter-tag ${activeFilter === f.key ? 'filter-tag-active' : ''}`}
          >
            {f.label}
          </button>
        ))}
      </section>

      {/* 最新项目 */}
      {showProjects && (
        <section>
          <div className="section-divider" />
          <div className="mb-6 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-slate-100">
              <FolderGit2 className="h-5 w-5 text-primary" />
              最新项目
            </h2>
            <Link href="/projects/" className="btn-small">
              查看全部
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="stagger-container grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.slice(0, 3).map((project) => (
              <div key={project.slug} className="stagger-item">
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 学习笔记 */}
      {showNotes && (
        <section>
          <div className="section-divider" />
          <div className="mb-6 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-slate-100">
              <FileText className="h-5 w-5 text-primary" />
              学习笔记
            </h2>
            <Link href="/notes/" className="btn-small">
              查看全部
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="stagger-container flex flex-col gap-3">
            {filteredNotes.slice(0, 3).map((note) => (
              <div key={note.slug} className="stagger-item">
                <NoteCard note={note} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 关于本站 */}
      <section>
        <div className="section-divider" />
        <div className="rounded-xl border border-border/50 bg-bg-soft/50 px-6 py-5 text-center backdrop-sm">
          <p className="text-sm leading-relaxed text-text-muted">
            本站记录嵌入式开发、电源硬件、PCB 调试的实践笔记与工程项目，所有内容仅供学习交流，转载请注明出处。
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <Link href="/notes/" className="btn-small">
              <BookOpen className="h-3.5 w-3.5" />
              浏览笔记
            </Link>
            <Link href="/resume/" className="btn-small">
              <ArrowRight className="h-3.5 w-3.5" />
              查看简历
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
