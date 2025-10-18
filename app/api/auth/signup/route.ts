// app/api/auth/signup/route.ts
import { adminAuth, adminDb, admin } from '@/lib/firebaseAdmin';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ 
        success: false, 
        error: 'Name, email, and password are required' 
      }, { status: 400 });
    }

    // 1. Create the user in Firebase Auth
    const userRecord = await adminAuth.createUser({
      email: email,
      password: password,
      displayName: name,
    });

    // 2. Create a corresponding user document in Firestore
    await adminDb.collection('users').doc(userRecord.uid).set({
      name: name,
      email: email,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ 
      success: true, 
      uid: userRecord.uid,
      message: 'User created successfully' 
    }, { status: 201 });

  } catch (error: any) {
    console.error('SIGNUP ERROR:', error);
    
    // Handle specific Firebase errors
    let errorMessage = 'An error occurred during signup';
    if (error.code === 'auth/email-already-exists') {
      errorMessage = 'Email already exists';
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'Password is too weak';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email address';
    } else if (error.message) {
      errorMessage = error.message;
    }

    return NextResponse.json({ 
      success: false, 
      error: errorMessage 
    }, { status: 400 });
  }
}