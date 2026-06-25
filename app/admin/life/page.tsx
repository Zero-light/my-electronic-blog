'use client';

import { useState } from 'react';
import { lifeMoments as initialMoments, TopCategory, LifeMoment } from '@/content/data/life-moments';

export default function AdminLifePage() {
  const [moments, setMoments] = useState<LifeMoment[]>(JSON.parse(JSON.stringify(initialMoments)));

  const update = (i: number, partial: Partial<LifeMoment>) => {
    const m = [...moments]; m[i] = { ...m[i], ...partial }; setMoments(m);
  };

  const add = () => {
    const newId = "m" + Date.now();
    setMoments([...moments, { id: newId, topCategory: 'travel' as TopCategory, subCategory: '', date: new Date().toISOString().split('T')[0], content: '', images: [] }]);
  };

  const genCode = (): string => {
    const items = moments.map(m => {
      const imgs = m.images.length > 0 ? '    ' + m.images.map(img => "'" + img + "'").join(',') : '';
      const loc = m.location ? ",\n    location: '" + m.location + "'" : '';
      return "  {\n    id: '" + m.id + "',\n    topCategory: '" + m.topCategory + "',\n    subCategory: '" + m.subCategory + "',\n    date: '" + m.date + "',\n    content: '" + m.content.replace(/'/g, "\\'").replace(/\n/g, "\\n") + "',\n    images: [" + imgs + "\n    ]" + loc + ",\n  }";
    }).join(',\n');
    return "/* life moments */\nexport const lifeMoments = [\n" + items + "\n];\nexport const subCategoryMap = {};\n";
  };

  const download = () => {
    const blob = new Blob([genCode()], { type: 'text/typescript;charset=utf-8' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'life-moments.ts'; a.click();
  };

  return (
    <div className="mx-auto max-w-4xl py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">编辑生活动态</h1>
        <div className="flex gap-2">
          <button onClick={add} className="bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700">+ 新增</button>
          <button onClick={download} className="bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700">导出文件</button>
        </div>
      </div>
      <p className="text-text-muted">共 {moments.length} 条动态</p>

      {moments.map((m, i) => (
        <div key={m.id} className="border rounded-xl p-5 space-y-3 bg-white dark:bg-gray-900">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">{m.id}</span>
            <button onClick={() => setMoments(moments.filter((_,j) => j !== i))}
              className="text-red-500 text-sm">删除</button>
          </div>
          <div className="grid gap-3 sm:grid-cols-4">
            <select className="border rounded px-3 py-2 text-sm bg-white dark:bg-gray-800" value={m.topCategory}
              onChange={e => update(i, { topCategory: e.target.value as TopCategory })}>
              <option value="game">游戏</option>
              <option value="music">音乐</option>
              <option value="travel">旅游</option>
            </select>
            <input className="border rounded px-3 py-2 text-sm" placeholder="子分类" value={m.subCategory}
              onChange={e => update(i, { subCategory: e.target.value })} />
            <input className="border rounded px-3 py-2 text-sm" type="date" value={m.date}
              onChange={e => update(i, { date: e.target.value })} />
            <input className="border rounded px-3 py-2 text-sm" placeholder="地点(可选)" value={m.location || ''}
              onChange={e => update(i, { location: e.target.value })} />
          </div>
          <textarea className="w-full border rounded px-3 py-2 text-sm" rows={3} value={m.content}
            onChange={e => update(i, { content: e.target.value })} />
          <div>
            <label className="text-xs text-gray-500">图片链接（每行一个）</label>
            <textarea className="w-full border rounded px-3 py-2 text-sm mt-1" rows={2}
              value={m.images.join('\n')}
              onChange={e => update(i, { images: e.target.value.split('\n').filter(Boolean) })} />
          </div>
        </div>
      ))}
    </div>
  );
}
