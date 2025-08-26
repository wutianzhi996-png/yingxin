import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: '1.0.0'
  })
}

export async function POST() {
  return NextResponse.json({ 
    method: 'POST', 
    status: 'healthy' 
  })
}