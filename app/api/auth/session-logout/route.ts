// app/api/auth/session-logout/route.ts
import { getSession } from '@/lib/session';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    session.destroy();
    return NextResponse.json({ success: true, status: 'Session destroyed' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}