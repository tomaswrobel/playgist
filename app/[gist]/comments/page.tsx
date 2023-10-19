import type GistProps from "../props";
import {cookies} from "next/headers";
import Image from "next/image";

export default async function GistComments(props: GistProps) {
    const token = cookies().get("token")?.value;
    const headers = new Headers();

    if (token) {
        headers.append("Authorization", `Bearer ${token}`);
    }

    const response = await fetch(`https://api.github.com/gists/${props.params.gist}/comments`, {
        method: "GET",
        headers
    });

    if (!response.ok) {
        return <div className="text-center">Gist not found</div>;
    }

    const comments = await response.json();

    return (
        <div className="bg-gray-900 text-white h-screen">
            <div className="mt-5">
                {comments.length ? comments.map((comment: any) => (
                    <div className="m-5" key={comment.id}>
                        <div className="text-left">
                            <Image
                                src={comment.user.avatar_url}
                                alt="" width={32} height={32}
                                className="inline-block rounded-full mr-2"
                            />
                            <a href={`https://github.com/${comment.user.login}`} className="text-blue-500">
                                {comment.user.login}
                            </a>
                        </div>
                        <div className="mt-2 bg-white text-black p-4 rounded">
                            {comment.body}
                        </div>
                    </div>
                )) : "No comments."}
                <br />
                <a href={`https://gist.github.com/${props.params.gist}`} className="text-blue-500">
                    Add one on GitHub
                </a>
            </div>
        </div>
    );
}