import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const move = body.move;

  // Here you can store moves in a DB, validate, etc.
  console.log('Move received from client:', move);

  return NextResponse.json({ status: 'ok', received: move });
}
