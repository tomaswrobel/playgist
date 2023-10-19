"use client";

import IDE from "./ide";
import NavItem from "./nav-item";
import {useRef, useState} from "react";

function GistIDE(props: GistIDE.Props) {
    const updateTimeout = useRef(0);
    const [files, setFiles] = useState(props.files);

    return (
        <IDE
            files={files}
            readOnly={props.readOnly}
            onFileChange={(file, content) => {
                clearTimeout(updateTimeout.current);
                updateTimeout.current = setTimeout(() => {
                    fetch("/api/update", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            gist: props.gist,
                            files: {
                                [file]: {content}
                            }
                        })
                    });
                }, 1000) as unknown as number;

                setFiles({
                    ...files,
                    [file]: content
                });
            }}
            onCreatedFile={async file => {
                await fetch("/api/update", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        gist: props.gist,
                        files: {
                            [file]: {
                                content: ""
                            }
                        }
                    })
                });

                setFiles({
                    ...files,
                    [file]: ""
                });
            }}
            onDeletedFile={async file => {
                const newState = {...files};
                delete newState[file];

                await fetch("/api/update", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        gist: props.gist,
                        files: {
                            [file]: {
                                content: null
                            }
                        }
                    })
                });

                setFiles(newState);
            }}
        >
            <NavItem href={`https://gist.github.com/${props.gist}`} target="_blank">View on GitHub</NavItem>
            <NavItem href="comments" target="output">Comments</NavItem>
            {props.readOnly && (
                <form action="/api/save" method="POST" className="contents">
                    {Object.entries(files).map(([file, content], i) => (
                        <input type="hidden" name={file} value={content} key={i} />
                    ))}
                    <button type="submit" className="appearance-none bg-transparent text-[#c9d1d9] text-left cursor-pointer hover:bg-[#00000026] no-underline p-2.5 inline-block">
                        Fork
                    </button>
                </form>
            )}
        </IDE>
    );
}

declare namespace GistIDE {
    interface Props {
        gist: string;
        readOnly: boolean;
        files: Record<string, string>;
    }
}

export default GistIDE;