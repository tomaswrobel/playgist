import {cookies} from "next/headers";

export async function POST(request: Request) {
    const files = await request.json();
    const content: Record<string, Record<"content", string>> = {};

    for (const filename in files) {
        content[filename] = {
            content: files[filename],
        };
    }

    return fetch("https://api.github.com/gists", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${cookies().get("token")?.value}`,
        },
        body: JSON.stringify({
            description: "Gist created by https://playgist.dev",
            public: true,
            files: content,
        }),
    });
}