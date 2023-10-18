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
            readOnly={true}
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