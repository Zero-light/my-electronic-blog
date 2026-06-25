'use client';

import { useState } from 'react';
import { skillCategories as initialSkills, SkillCategory, SkillItem } from '@/content/data/skills';

export default function AdminSkillsPage() {
  const [cats, setCats] = useState<SkillCategory[]>(JSON.parse(JSON.stringify(initialSkills)));

  const updateItem = (catIdx: number, itemIdx: number, partial: Partial<SkillItem>) => {
    const c = [...cats];
    c[catIdx] = { ...c[catIdx], items: c[catIdx].items.map((it, j) => j === itemIdx ? { ...it, ...partial } : it) };
    setCats(c);
  };

  const addItem = (catIdx: number) => {
    const c = [...cats];
    c[catIdx] = { ...c[catIdx], items: [...c[catIdx].items, { name: '', level: 50 }] };
    setCats(c);
  };

  const removeItem = (catIdx: number, itemIdx: number) => {
    const c = [...cats];
    c[catIdx] = { ...c[catIdx], items: c[catIdx].items.filter((_, j) => j !== itemIdx) };
    setCats(c);
  };

  const download = () => {
    const catStr = cats.map(c => {
      const items = c.items.map(i => "      { name: '" + i.name.replace(/'/g, "\\'") + "', level: " + i.level + " }").join(',\n');
      return "  {\n    title: '" + c.title.replace(/'/g, "\\'") + "',\n    items: [\n" + items + "\n    ],\n  }";
    }).join(',\n');
    const code = "/* skills */\nexport const skillCategories = [\n" + catStr + "\n];\n";
    const blob = new Blob([code], { type: 'text/typescript;charset=utf-8' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'skills.ts'; a.click();
  };

  return (
    <div className="mx-auto max-w-4xl py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">编辑技能列表</h1>
        <button onClick={download} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">导出文件</button>
      </div>
      {cats.map((cat, ci) => (
        <section key={ci} className="border rounded-xl p-6 space-y-4 bg-white dark:bg-gray-900">
          <div className="flex justify-between items-center">
            <input className="text-lg font-semibold border-b px-2 py-1" value={cat.title}
              onChange={e => { const c = [...cats]; c[ci] = { ...c[ci], title: e.target.value }; setCats(c); }} />
            <div className="flex gap-2">
              <button onClick={() => addItem(ci)} className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded">+ 添加技能</button>
              <button onClick={() => setCats(cats.filter((_,j) => j !== ci))} className="text-sm text-red-500">删除分类</button>
            </div>
          </div>
          {cat.items.map((item, ii) => (
            <div key={ii} className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <input className="flex-1 border rounded px-3 py-2 text-sm" value={item.name}
                onChange={e => updateItem(ci, ii, { name: e.target.value })} />
              <div className="flex items-center gap-2 w-48">
                <input type="range" min={0} max={100} className="flex-1" value={item.level}
                  onChange={e => updateItem(ci, ii, { level: parseInt(e.target.value) })} />
                <span className="text-sm w-8 text-right">{item.level}</span>
              </div>
              <button onClick={() => removeItem(ci, ii)} className="text-red-500 text-sm">✕</button>
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}
