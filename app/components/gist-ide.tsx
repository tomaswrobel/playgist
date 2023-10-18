"use client";

import IDE from "./ide";
import NavItem from "./nav-item";
import {useRef, useState} from "react";

function GistIDE(props: GistIDE.Props) {
    const updateTimeout = useRef(0);
    const files = useRef(props.files);
    const [, setUpdate] = useState(0);

    return (
        <IDE
            files={files.current}
            readOnly={true}
            onFileChange={(file, content) => {
                files.current = {
                    ...files.current,
                    [file]: content
                };

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
            }}
            onCreatedFile={file => {
                fetch("/api/update", {
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
                }).then(() => setUpdate(n => n + 1));

                files.current = {
                    ...files.current,
                    [file]: ""
                };
            }}
            onDeletedFile={file => {
                const newState = {...files.current};
                delete newState[file];

                fetch("/api/update", {
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
                }).then(() => setUpdate(n => n + 1));

                files.current = newState;
            }}
        >
            <NavItem href={`https://gist.github.com/${props.gist}`} target="_blank">View on GitHub</NavItem>
        </IDE>
    );
}

declare namespace GistIDE {
    interface Props {
        gist: string;
        files: Record<string, string>;
    }
}

export default GistIDE;