// e.g. /api/file?repository=A

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  console.log(request.nextUrl.searchParams);
  const repository = request.nextUrl.searchParams.get('repository');
  if (!repository) {
    return NextResponse.json(
      { error: 'repository parameter is required' },
      { status: 400 }
    );
  }
  switch (repository) {
    case 'A-hoge':
      return NextResponse.json({
        filepath: ['A-hoge.ts', 'A-hoge.tsx'],
      });
    case 'A-fuga':
      return NextResponse.json({
        filepath: ['A-fuga.ts', 'A-fuga.tsx'],
      });
    case 'B-hoge':
      return NextResponse.json({
        filepath: ['B-hoge.ts', 'B-hoge.tsx'],
      });
    case 'B-fuga':
      return NextResponse.json({
        filepath: ['B-fuga.ts', 'B-fuga.tsx'],
      });
    default:
      return NextResponse.json(
        { error: 'repository not found' },
        { status: 404, statusText: 'Not Found' }
      );
  }
}
