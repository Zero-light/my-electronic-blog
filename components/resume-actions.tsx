'use client';

import { Download, Printer } from 'lucide-react';

/**
 * 简历操作栏（打印 + 下载）
 * - 独立 Client Component，避免在服务端访问 window
 * - 打印时隐藏
 */
export function ResumeActions() {
  return (
    <div className="flex flex-wrap items-center gap-3 print:hidden">
      <a href="/pdfs/resume.pdf" download className="btn-primary">
        <Download className="h-4 w-4" />
        下载 PDF
      </a>
      <button
        type="button"
        onClick={() => window.print()}
        className="btn-ghost"
      >
        <Printer className="h-4 w-4" />
        打印
      </button>
    </div>
  );
}
