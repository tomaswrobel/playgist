"use client";

import {useEffect, useState} from "react";
import * as Storage from "../utils/storage";
import IDE from "./ide";

const files: Record<string, string> = {
    "index.css": "* {\n\tbox-sizing: border-box;\n}\n\nhtml {\n\tfont-family: sans-serif;\n}",
    "index.tsx": "/*\n * Here's an example of a React Component. However,\n * you can use another framework, or just import \n * libraries like jQuery, lodash, d3, etc.\n */\nimport * as ReactDOM from \"react-dom\";\nimport * as React from \"react\";\nimport \"./index.css\";\n\nfunction Counter() {\n\tconst [count, setCount] = React.useState(0);\n\t\n\treturn (\n\t\t<div>\n\t\t\t<p>Count: {count}</p>\n\t\t\t<button onClick={() => setCount(count + 1)}>Increment</button>\n\t\t</div>\n\t);\n}\n\nReactDOM.render(\n\t<Counter />,\n\tdocument.body\n);"
};

export default function LocalEditor() {
    const [state, setState] = useState(Storage.get("files", files));
    useEffect(() => Storage.set("files", state), [state]);

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
        />
    );
}
