import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get('file') as File | null;
  if (!file) return NextResponse.json({ message: 'No file' }, { status: 400 });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const filename = file.name.replace(/\s+/g, '-').toLowerCase();
  const dest = path.join(process.cwd(), 'public', 'products', filename);

  await writeFile(dest, buffer);
  return NextResponse.json({ path: `/products/${filename}` });
}
