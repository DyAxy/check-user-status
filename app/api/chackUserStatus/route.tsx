export async function GET(request: Request) {
    const { search } = new URL(request.url)
    const res = await fetch(`${process.env.API}${search}`)
    const data = await res.json()
    return new Response(
        JSON.stringify(data),
        {
            status: res.status,
            headers: { 'Content-Type': 'application/json' },
        })
}