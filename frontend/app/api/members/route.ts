import { NextRequest, NextResponse } from 'next/server'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://dut-ai-web-api.dutai.site/api/v1'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const query = searchParams.toString()
        const url = `${API_BASE}/members${query ? `?${query}` : ''}`

        const res = await fetch(url, {
            next: { revalidate: 300 }, // cache 5 minutes
        })
        if (!res.ok) {
            return NextResponse.json({ error: 'Failed to fetch members' }, { status: res.status })
        }
        const data = await res.json()
        return NextResponse.json(data)
    } catch {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
