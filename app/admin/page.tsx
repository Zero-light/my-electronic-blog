import Link from 'next/link';

const sections = [
  { title: '👤 个人档案', desc: '编辑姓名、邮箱、教育经历', href: '/admin/profile' },
  { title: '📝 生活动态', desc: '管理游戏、音乐、旅游动态', href: '/admin/life' },
  { title: '⚡ 技能列表', desc: '编辑技能数据', href: '/admin/skills' },
  { title: '📚 书籍管理', desc: '管理学习/娱乐书籍', href: '/admin/books' },
  { title: '🖼️ 相册管理', desc: '管理图库分类', href: '/admin/gallery' },
];

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-4xl animate-fade-in space-y-8 py-12">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">内容管理后台</h1>
        <p className="text-text-muted">编辑数据后点击「导出文件」，下载 .ts 文件替换到 content/data/</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {sections.map(s => (
          <Link key={s.href} href={s.href}
            className="group rounded-xl border border-border bg-bg p-5 transition-all hover:border-primary hover:shadow-md">
            <h2 className="text-lg font-semibold group-hover:text-primary">{s.title}</h2>
            <p className="mt-1 text-sm text-text-muted">{s.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
