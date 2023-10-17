"use client";

import IDE from "./ide";
import {useRef} from "react";
import NavItem from "./nav-item";

function GistIDE(props: GistIDE.Props) {
    const updateTimeout = useRef(0);
    const files = useRef(props.files);

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
                            files: files.current
                        })
                    });
                }, 1000) as unknown as number;
            }}
            onCreatedFile={file => {
                const newState = {...files.current};
                newState[file] = "";

                fetch("/api/update", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        gist: props.gist,
                        files: newState
                    })
                });

                files.current = newState;
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
                            ...newState,
                            [file]: null
                        }
                    })
                });

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