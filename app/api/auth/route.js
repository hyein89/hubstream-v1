import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req) {
  const { email, password } = await req.json();

  // Tarik data dari Vercel Environment Variables
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (email === adminEmail && password === adminPassword) {
    // Jika benar, simpan "tanda masuk" di cookie selama 24 jam
    const response = NextResponse.json({ message: 'Success' });
    response.cookies.set('admin_session', 'authorized_true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 hari
      path: '/',
    });
    return response;
  }

  return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
}
