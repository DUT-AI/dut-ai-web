import { NextResponse } from 'next/server'

export function corsHeaders(requestOrigin?: string | null) {
  let allowOrigin = '*'
  const isAllowedSubdomain =
    requestOrigin &&
    (requestOrigin.endsWith('.dutai.io.vn') ||
      requestOrigin === 'https://dutai.io.vn' ||
      requestOrigin.startsWith('http://localhost:') ||
      requestOrigin.startsWith('http://127.0.0.1:'))

  if (isAllowedSubdomain && requestOrigin) {
    allowOrigin = requestOrigin
  }

  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers':
      'Content-Type, Authorization, X-API-Key, Cookie, x-dev-access-token',
    'Access-Control-Allow-Credentials': 'true',
  }
}

export function jsonResponse(data: unknown, status = 200, origin?: string | null) {
  return NextResponse.json(data, {
    status,
    headers: corsHeaders(origin),
  })
}

export function errorResponse(message: string, status = 500, origin?: string | null) {
  return NextResponse.json(
    { error: message },
    {
      status,
      headers: corsHeaders(origin),
    }
  )
}
