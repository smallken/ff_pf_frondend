import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const biz = formData.get('biz') as string;

    if (!file) {
      return NextResponse.json({ error: '没有文件' }, { status: 400 });
    }

    if (!biz) {
      return NextResponse.json({ error: '缺少业务类型' }, { status: 400 });
    }

    // 检查环境变量
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) {
      console.error('❌ Vercel Blob Token未配置');
      return NextResponse.json({ error: '服务器配置错误' }, { status: 500 });
    }

    // 生成文件名
    const timestamp = Date.now();
    const filename = `${biz}/${timestamp}-${file.name}`;
    
    // 上传到Vercel Blob
    const blob = await put(filename, file, {
      access: 'public',
      token: token,
    });

    return NextResponse.json({ 
      success: true, 
      url: blob.url,
      filename: filename 
    });

  } catch (error) {
    console.error('❌ 文件上传失败:', error);
    return NextResponse.json({ 
      error: '文件上传失败',
      details: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 });
  }
}
