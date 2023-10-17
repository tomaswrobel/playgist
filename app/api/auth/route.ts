import type {NextRequest} from "next/server";

export async function GET(request: NextRequest) {
    const code = request.nextUrl.searchParams.get("code");

    const body = new FormData();
    body.append("code", code!);
    body.append("client_id", process.env.CLIENT_ID!);
    body.append("client_secret", process.env.CLIENT_SECRET!);

    const response = await fetch(
        "https://github.com/login/oauth/access_token",
        {
            method: "POST",
            headers: {
                "Accept": "application/json"
            },
            body,
        }
    );

    const {access_token} = await response.json();

    return new Response(null, {
        headers: {
            "Location": "/",
            "Set-Cookie": `token=${access_token}; Path=/; HttpOnly; Secure; SameSite=Lax`
        }, 
        status: 303
    });
}