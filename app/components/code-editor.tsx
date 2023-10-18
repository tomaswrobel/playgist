"use client";

import {useEffect, useRef} from "react";
import {type PrismEditor, createEditor, EditorOptions} from "prism-code-editor";
import Prism from "prism-code-editor/prism-core";

import "prismjs/components/prism-markup.js";
import "prismjs/components/prism-clike.js";
import "prismjs/components/prism-javascript.js";
import "prismjs/components/prism-typescript.js";
import "prismjs/components/prism-jsx.js";
import "prismjs/components/prism-tsx.js";
import "prismjs/components/prism-css.js";

import "prism-code-editor/layout.css";
import "prism-code-editor/scrollbar.css";
import "prism-code-editor/themes/prism-okaidia.css";

import "./code-editor.css";

export default function PrismEditorReact(props: Partial<EditorOptions>) {
    const divRef = useRef<HTMLDivElement>(null);
    const editorRef = useRef<PrismEditor>();

    useEffect(
        () => {
            if (editorRef.current) {
                editorRef.current.setOptions(props);
            } else {
                const div = divRef.current!;
                editorRef.current = createEditor(Prism, div, props);
            }
        },
        [props]
    );

    return <div className="prism-editor-react h-full" ref={divRef} />;
};