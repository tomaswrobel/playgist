import {NextRequest} from "next/server"

export function GET(req: NextRequest) {
    return new Response(
        req.nextUrl.searchParams.get("text") || "Unknown error.",
        {
            headers: {
                "Content-Type": "text/plain",
            },
        },
    )
}