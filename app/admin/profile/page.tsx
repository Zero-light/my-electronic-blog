'use client';

import { useState } from 'react';
import { profile as initialProfile, Profile } from '@/content/data/profile';

function esc(s: string): string {
  return s.replace(/'/g, "\\'").replace(/\n/g, "\\n");
}

function genCode(p: Profile): string {
  const edu = p.education.map(e =>
    '    { school: ' + "'" + esc(e.school) + "'" + ', major: ' + "'" + esc(e.major) + "'" + ', degree: ' + "'" + esc(e.degree) + "'" + ', period: ' + "'" + esc(e.period) + "'" + ', description: ' + "'" + esc(e.description || '') + "'" + ' }'
  ).join(',\n');
  const exp = p.experience.map(e =>
    '    { company: ' + "'" + esc(e.company) + "'" + ', role: ' + "'" + esc(e.role) + "'" + ', period: ' + "'" + esc(e.period) + "'" + ', description: ' + "'" + esc(e.description) + "'" + ' }'
  ).join(',\n');
  const hon = p.honors.map(h => '    ' + "'" + esc(h) + "'").join(',\n');
  const q = "'";
  return '/* profile data */\nexport const profile = {\n' +
    '  name: ' + q + esc(p.name) + q + ',\n' +
    '  title: ' + q + esc(p.title) + q + ',\n' +
    '  email: ' + q + esc(p.email) + q + ',\n' +
    '  phone: ' + q + esc(p.phone) + q + ',\n' +
    '  github: ' + q + esc(p.github) + q + ',\n' +
    '  location: ' + q + esc(p.location) + q + ',\n' +
    '  summary: ' + q + esc(p.summary) + q + ',\n' +
    '  objective: ' + q + esc(p.objective) + q + ',\n' +
    '  education: [\n' + edu + '\n  ],\n' +
    '  experience: [\n' + exp + '\n  ],\n' +
    '  honors: [\n' + hon + '\n  ],\n};\n';
}

export default function AdminProfilePage() {
  const [p, setP] = useState<Profile>(JSON.parse(JSON.stringify(initialProfile)));
  const upd = (partial: any) => setP((prev: Profile) => ({ ...prev, ...partial }));

  const updateArr = (key: string, arr: any[], i: number, val: any) => {
    const n = [...arr]; n[i] = { ...n[i], ...val };
    upd({ [key]: n });
  };

  const download = () => {
    const blob = new Blob([genCode(p)], { type: 'text/typescript;charset=utf-8' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'profile.ts'; a.click();
  };

  return (
    <div className="mx-auto max-w-4xl py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">编辑个人档案</h1>
        <button onClick={download} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">导出文件</button>
      </div>

      <section className="border rounded-xl p-6 space-y-4 bg-white dark:bg-gray-900">
        <h2 className="text-lg font-semibold">基本信息</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {[['name','姓名'],['title','标题'],['email','邮箱'],['phone','电话'],['github','GitHub'],['location','地点']].map(([k,l]) => (
            <div key={k}>
              <label className="block text-sm font-medium mb-1">{l}</label>
              <input className="w-full border rounded px-3 py-2 text-sm" value={(p as any)[k]}
                onChange={e => upd({ [k]: e.target.value })} />
            </div>
          ))}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">个人简介</label>
          <textarea className="w-full border rounded px-3 py-2 text-sm" rows={4} value={p.summary}
            onChange={e => upd({ summary: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">求职意向</label>
          <textarea className="w-full border rounded px-3 py-2 text-sm" rows={2} value={p.objective}
            onChange={e => upd({ objective: e.target.value })} />
        </div>
      </section>

      <section className="border rounded-xl p-6 space-y-4 bg-white dark:bg-gray-900">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">教育经历</h2>
          <button onClick={() => upd({ education: [...p.education, { school:'', major:'', degree:'', period:'', description:'' }] })}
            className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200">+ 添加</button>
        </div>
        {p.education.map((e, i) => (
          <div key={i} className="border rounded-lg p-4 space-y-3 bg-gray-50 dark:bg-gray-800">
            <div className="flex justify-end">
              <button onClick={() => upd({ education: p.education.filter((_:any,j:number) => j !== i) })}
                className="text-sm text-red-500">删除</button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <input className="border rounded px-3 py-2 text-sm" placeholder="学校" value={e.school}
                onChange={ev => updateArr('education', p.education, i, { school: ev.target.value })} />
              <input className="border rounded px-3 py-2 text-sm" placeholder="专业" value={e.major}
                onChange={ev => updateArr('education', p.education, i, { major: ev.target.value })} />
              <input className="border rounded px-3 py-2 text-sm" placeholder="学位" value={e.degree}
                onChange={ev => updateArr('education', p.education, i, { degree: ev.target.value })} />
              <input className="border rounded px-3 py-2 text-sm" placeholder="时间段" value={e.period}
                onChange={ev => updateArr('education', p.education, i, { period: ev.target.value })} />
            </div>
            <textarea className="w-full border rounded px-3 py-2 text-sm" rows={2} placeholder="描述" value={e.description || ''}
              onChange={ev => updateArr('education', p.education, i, { description: ev.target.value })} />
          </div>
        ))}
      </section>

      <section className="border rounded-xl p-6 space-y-4 bg-white dark:bg-gray-900">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">项目经历</h2>
          <button onClick={() => upd({ experience: [...p.experience, { company:'', role:'', period:'', description:'' }] })}
            className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200">+ 添加</button>
        </div>
        {p.experience.map((e, i) => (
          <div key={i} className="border rounded-lg p-4 space-y-3 bg-gray-50 dark:bg-gray-800">
            <div className="flex justify-end">
              <button onClick={() => upd({ experience: p.experience.filter((_:any,j:number) => j !== i) })}
                className="text-sm text-red-500">删除</button>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <input className="border rounded px-3 py-2 text-sm" placeholder="公司/项目" value={e.company}
                onChange={ev => updateArr('experience', p.experience, i, { company: ev.target.value })} />
              <input className="border rounded px-3 py-2 text-sm" placeholder="角色" value={e.role}
                onChange={ev => updateArr('experience', p.experience, i, { role: ev.target.value })} />
              <input className="border rounded px-3 py-2 text-sm" placeholder="时间段" value={e.period}
                onChange={ev => updateArr('experience', p.experience, i, { period: ev.target.value })} />
            </div>
            <textarea className="w-full border rounded px-3 py-2 text-sm" rows={3} value={e.description}
              onChange={ev => updateArr('experience', p.experience, i, { description: ev.target.value })} />
          </div>
        ))}
      </section>

      <section className="border rounded-xl p-6 space-y-4 bg-white dark:bg-gray-900">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">荣誉奖项</h2>
          <button onClick={() => upd({ honors: [...p.honors, ''] })}
            className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200">+ 添加</button>
        </div>
        {p.honors.map((h, i) => (
          <div key={i} className="flex items-center gap-2">
            <input className="flex-1 border rounded px-3 py-2 text-sm" value={h}
              onChange={e => { const h2 = [...p.honors]; h2[i] = e.target.value; upd({ honors: h2 }); }} />
            <button onClick={() => upd({ honors: p.honors.filter((_:any,j:number) => j !== i) })}
              className="text-red-500 text-sm">✕</button>
          </div>
        ))}
      </section>
    </div>
  );
}
