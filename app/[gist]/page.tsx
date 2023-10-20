import {cookies} from "next/headers";
import GistIDE from "../components/gist-ide";
import GistProps from "./props";

export default async function GistPage({params: {gist}}: GistProps) {
    const token = cookies().get("token")?.value;
    const headers = new Headers();

    if (token) {
        headers.append("Authorization", `Bearer ${token}`);
    }


    const response = await fetch(`https://api.github.com/gists/${gist}`, {
        method: "GET",
        headers
    });

    if (!response.ok) {
        return (
            <div className="text-center">
                Gist not found
                <br />
                {token ? (
                    <a href={`https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&scope=gist`}>
                        Try to login
                    </a>
                ) : (
                    <a href="/" className="text-blue-500">
                        Go back
                    </a>
                )}
            </div>
        );
    }

    const {files, owner} = await response.json();
    let access = false;

    if (token) {
        const {login} = await fetch("https://api.github.com/user", {headers}).then(response => response.json());
        access = login === owner.login;
    }
    
    const content: Record<string, string> = {};

    for (const file in files) {
        content[file] = files[file].content;
    }

    return <GistIDE gist={gist} files={content} readOnly={!access} />;
}