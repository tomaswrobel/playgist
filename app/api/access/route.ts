import {cookies} from "next/headers";
import {NextRequest} from "next/server";

export async function GET(request: NextRequest) {
    const token = cookies().get("token")?.value;
    const gist = request.nextUrl.searchParams.get("gist");

    if (token) {
        const {login} = await fetch("https://api.github.com/user", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((response) => response.json());

        const {owner} = await fetch("https://api.github.com/gists/" + gist, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((response) => response.json());
        
        return Response.json(login === owner.login);
    }

    return Response.json(false);
}