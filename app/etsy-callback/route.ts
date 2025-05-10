import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'Brakuje kodu autoryzacyjnego' }, { status: 400 });
  }

  const client_id = 'iysbdfdkxgevnjasba5pxtuu';
  const client_secret = 'c5zwk1g9nu';
  const redirect_uri = 'https://nextjs-boilerplate.vercel.app/api/etsy-callback';
  const tokenEndpoint = 'https://api.etsy.com/v3/public/oauth/token';

  try {
    const auth = Buffer.from(`${client_id}:${client_secret}`).toString('base64');

    const res = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: data }, { status: 500 });
    }

    return NextResponse.json({ token: data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Błąd przy żądaniu do Etsy' }, { status: 500 });
  }
}
