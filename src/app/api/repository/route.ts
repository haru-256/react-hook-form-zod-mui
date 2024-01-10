// e.g. /api/repository?user=A

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  console.log(request.nextUrl.searchParams);
  const user = request.nextUrl.searchParams.get('user');
  if (!user) {
    return NextResponse.json(
      { error: 'user parameter is required' },
      { status: 400 }
    );
  }
  switch (user) {
    case 'A':
      return NextResponse.json([
        { repository: 'A-hoge' },
        { repository: 'A-fuga' },
      ]);
    case 'B':
      return NextResponse.json([
        { repository: 'B-hoge' },
        { repository: 'B-fuga' },
      ]);
    default:
      return NextResponse.json(
        { error: 'repository not found' },
        { status: 404, statusText: 'Not Found' }
      );
  }
}
