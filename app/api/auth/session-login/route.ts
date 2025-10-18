// app/api/auth/session-login/route.ts
import { adminAuth } from '@/lib/firebaseAdmin';
import { getSession, sessionOptions } from '@/lib/session';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { idToken } = await request.json();

    // 1. Verify the ID token with Firebase Admin
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const { uid, email } = decodedToken;

    // 2. Get the session
    const session = await getSession();

    // 3. Set session data
    session.uid = uid;
    session.email = email || '';
    session.isLoggedIn = true;
    await session.save();

    // 4. Return a success response
    return NextResponse.json({ success: true, status: 'Session created' });

  } catch (error: any) {
    console.error('SESSION LOGIN ERROR:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 401 });
  }
}