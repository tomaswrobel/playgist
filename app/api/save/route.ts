import {cookies} from "next/headers";

export async function POST(request: Request) {
    const token = cookies().get("token")?.value;

    if (!token) {
        return Response.redirect(`https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&scope=gist`);
    }

    const data = await request.formData();
    const files: Record<string, Record<"content", FormDataEntryValue>> = {};

    for (const [filename, content] of data.entries()) {
        files[filename] = {content};
    }

    const response = await fetch("https://api.github.com/gists", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
            description: "Gist created by https://playgist.dev",
            public: true,
            files,
        }),
    });

    const {id} = await response.json();

    return new Response(null, {
        status: 303,
        headers: {
            "Location": `/${id}`
        }
    })
}