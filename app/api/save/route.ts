import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { filename, content } = body;
    
    if (!filename || !content) {
      return NextResponse.json({ success: false, error: 'Missing filename or content' }, { status: 400 });
    }
    
    // Security: only allow .ts files in content/data/
    const safeName = path.basename(filename);
    if (!safeName.endsWith('.ts')) {
      return NextResponse.json({ success: false, error: 'Only .ts files allowed' }, { status: 400 });
    }
    
    const filePath = path.join(process.cwd(), 'content', 'data', safeName);
    
    // Verify the target directory
    const targetDir = path.join(process.cwd(), 'content', 'data');
    if (!filePath.startsWith(targetDir)) {
      return NextResponse.json({ success: false, error: 'Invalid path' }, { status: 400 });
    }
    
    fs.writeFileSync(filePath, content, 'utf-8');
    
    return NextResponse.json({ success: true, file: safeName });
  } catch (error) {
    console.error('Save error:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
