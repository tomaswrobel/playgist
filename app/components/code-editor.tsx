"use client";

import Prism from "prismjs";
import "prismjs/components/prism-typescript.js";
import "prismjs/components/prism-jsx.js";
import "prismjs/components/prism-tsx.js";
import "prismjs/themes/prism-okaidia.css";

import "./code-editor.css";

function CodeEditor({code = "", onChange, readonly = false, language}: CodeEditor.Props) {
    return (
        <div className="code-editor">
            <div className="nums">
                {code.split("\n").map((_, i) => <div key={i}>{i + 1}</div>)}
            </div>
            <pre
                style={{color: "#F8F8F2"}} 
                dangerouslySetInnerHTML={{__html: Prism.highlight(code, Prism.languages[language], language)}}
            />
            {readonly || (
                <textarea
                    spellCheck={false}
                    value={code}
                    onChange={e => onChange(e.target.value)}
                    onKeyDown={e => {
                        if (e.key === "Tab") {
                            e.preventDefault();
                            document.execCommand("insertText", false, "\t");
                        }
                    }}
                />
            )}
        </div>
    )
};

declare namespace CodeEditor {
    interface Props {
        code?: string;
        onChange: (code: string) => void;
        readonly?: boolean;
        language: string;
    }
}

export default CodeEditor;