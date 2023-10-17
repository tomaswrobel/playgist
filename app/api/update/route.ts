import {cookies} from "next/headers";

export async function GET(request: Request) {
    const {value} = cookies().get("token")!;
    const {files, id} = await request.json();
    const content: Record<string, Record<"content", string>> = {};

    for (const filename in files) {
        content[filename] = {
            content: files[filename],
        };
    }

    return fetch("https://api.github.com/gists/" + id, {
        method: "PATCH",
        headers: {
            "Authorization": `Bearer ${value}`,
        },
        body: JSON.stringify({
            files: content,
        }),
    });
}