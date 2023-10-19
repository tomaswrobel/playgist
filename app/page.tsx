"use client";

import {useEffect, useState} from "react";
import * as Storage from "./utils/storage";
import IDE from "./components/ide";

const files: Record<string, string> = {
    "index.css": "* {\n\tbox-sizing: border-box;\n}\n\nhtml {\n\tfont-family: sans-serif;\n}",
    "index.tsx": "/*\n * Here's an example of a React Component. However,\n * you can use another framework, or just import \n * libraries like jQuery, lodash, d3, etc.\n */\nimport * as ReactDOM from \"react-dom\";\nimport * as React from \"react\";\nimport \"./index.css\";\n\nfunction Counter() {\n\tconst [count, setCount] = React.useState(0);\n\t\n\treturn (\n\t\t<div>\n\t\t\t<p>Count: {count}</p>\n\t\t\t<button onClick={() => setCount(count + 1)}>Increment</button>\n\t\t</div>\n\t);\n}\n\nReactDOM.render(\n\t<Counter />,\n\tdocument.body\n);"
};

export default function LocalIDE() {
    const [state, setState] = useState(files);
    
    useEffect(() => setState(Storage.get("files", files)), []);
    useEffect(
        () => {
            if (state !== files) {
                Storage.set("files", state)
            }
        }, 
        [state]
    );

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
            <form action="/api/save" method="POST" className="contents">
                {Object.entries(files).map(([file, content], i) => (
                    <input type="hidden" name={file} value={content} key={i} />
                ))}
                <button type="submit" className="appearance-none bg-transparent text-[#c9d1d9] text-left cursor-pointer hover:bg-[#00000026] no-underline p-2.5 inline-block">
                    Save as a Gist
                </button>
            </form>
        </IDE>
    );
}