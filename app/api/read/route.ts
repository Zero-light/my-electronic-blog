import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('file');
    if (!filename) return NextResponse.json({ success: false, error: 'Missing file' }, { status: 400 });
    const safeName = path.basename(filename);
    if (!safeName.endsWith('.ts')) return NextResponse.json({ success: false, error: 'Only .ts' }, { status: 400 });
    const filePath = path.join(process.cwd(), 'content', 'data', safeName);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return NextResponse.json({ success: true, content: fileContent });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}