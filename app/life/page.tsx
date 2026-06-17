import Link from 'next/link';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PenLine, Images } from 'lucide-react';

export default function LifePage() {
  return (
    <div className="animate-fade-in space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          生活记录
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          工作之外的点滴：随笔、摄影与爱好。
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/life/essays/">
          <Card hover className="h-full">
            <CardHeader>
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400">
                <PenLine className="h-5 w-5" />
              </div>
              <CardTitle>随笔日记</CardTitle>
              <CardDescription>
                阅读笔记、学期复盘与日常思考
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/life/gallery/">
          <Card hover className="h-full">
            <CardHeader>
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400">
                <Images className="h-5 w-5" />
              </div>
              <CardTitle>相册图库</CardTitle>
              <CardDescription>
                生活随拍、实验室作品与赛事实拍
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  );
}
