import {cookies} from "next/headers";

export async function POST(request: Request) {
    const {value} = cookies().get("token")!;
    const {files, id} = await request.json();

    return fetch("https://api.github.com/gists/" + id, {
        method: "PATCH",
        headers: {
            "Authorization": `Bearer ${value}`,
        },
        body: JSON.stringify({
            files,
        }),
    });
}