"use client";

import {useEffect, useState} from "react";
import * as Storage from "../utils/storage";
import IDE from "./ide";
import NavItem from "./nav-item";
import {useRouter} from "next/navigation";

const files: Record<string, string> = {
    "index.css": "* {\n\tbox-sizing: border-box;\n}\n\nhtml {\n\tfont-family: sans-serif;\n}",
    "index.tsx": "/*\n * Here's an example of a React Component. However,\n * you can use another framework, or just import \n * libraries like jQuery, lodash, d3, etc.\n */\nimport * as ReactDOM from \"react-dom\";\nimport * as React from \"react\";\nimport \"./index.css\";\n\nfunction Counter() {\n\tconst [count, setCount] = React.useState(0);\n\t\n\treturn (\n\t\t<div>\n\t\t\t<p>Count: {count}</p>\n\t\t\t<button onClick={() => setCount(count + 1)}>Increment</button>\n\t\t</div>\n\t);\n}\n\nReactDOM.render(\n\t<Counter />,\n\tdocument.body\n);"
};

export default function LocalIDE(props: Record<"auth", boolean>) {
    const [state, setState] = useState(Storage.get("files", files));
    useEffect(() => Storage.set("files", state), [state]);
    const router = useRouter();

    return (
        <IDE
            files={state}
            readOnly={false}
            onCreatedFile={(file) => {
                setState({
                    ...state,
                    [file]: "",
                });
            }}
            onDeletedFile={(file) => {
                const newState = {...state};
                delete newState[file];
                setState(newState);
            }}
            onFileChange={(file, content) => {
                setState({
                    ...state,
                    [file]: content,
                });
            }}
        >
            {props.auth ? (
                <NavItem
                    onClick={() => fetch("/api/save", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(state)
                    }).then(res => res.json()).then(res => router.push("/" + res.id))}
                >Save as Gist</NavItem>
            ) : (
                <NavItem href="/api/login">Login</NavItem>
            )}
        </IDE>
    );
}