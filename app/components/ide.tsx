"use client";

import {useState, type ReactNode} from "react";
import CodeEditor from "./code-editor";
import fileTypeLanguage from "../utils/file-type";
import FileIcon from "./file-icon";
import {transpile} from "../utils/transpile";
import "../font/fontello.css";
import NavItem from "./nav-item";
import NavDivider from "./nav-divider";

function IDE({onCreatedFile, files, readOnly = false, children, onDeletedFile = () => {}, onFileChange = () => {}}: IDE.Props) {
    const [file, setFile] = useState<string | null>(null);
    const [tabs, setTabs] = useState<string[]>([]);
    const [newFile, setNewFile] = useState<string | null>(null);

    const hasTab = !!file && file in files;

    return (
        <div className="flex flex-grow h-screen w-screen font-sans">
            <nav className="flex bg-[#272922] flex-col m-0 p-0 overflow-x-hidden overflow-y-auto w-[200px] border-solid border-r border-[#00000026]">
                <NavItem href="https://github.com/tomas-wrobel/playgist">Star on GitHub</NavItem>
                <NavDivider />
                {children}
                <a className="text-[#c9d1d9] cursor-pointer hover:bg-[#00000026] no-underline p-2.5 inline-block" onClick={() => {
                    setNewFile("");
                }}>New file...</a>
                <NavDivider />
                {Object.keys(files).map(file => (
                    <a key={"nav-" + file} className="text-[#c9d1d9] cursor-pointer hover:bg-[#00000026] no-underline p-2.5 inline-flex gap-2" onClick={() => {
                        setTabs([...tabs, file]);
                        setFile(file);
                    }} title={file}>
                        <FileIcon file={file} />
                        <span className="text-ellipsis overflow-hidden whitespace-pre">
                            {file}
                        </span>
                        <div className="flex-grow" />
                        <span className="font-[fontello] inline-block antialiased" onClick={() => {
                            if (tabs.includes(file)) {
                                setTabs(tabs.filter(s => s !== file));
                            }
                            onDeletedFile!(file);
                        }}>&#xe800;</span>
                    </a>
                ))}
                {newFile === null || (
                    <span className="text-[#c9d1d9] no-underline p-2.5 inline-flex gap-2">
                        <FileIcon file={newFile} />
                        <input
                            className="bg-[#383933] text-[#c9d1d9] border-solid border border-[#00000026] rounded w-full"
                            autoFocus
                            placeholder="New file..."
                            value={newFile}
                            onChange={e => setNewFile(e.currentTarget.value)}
                            onKeyDown={e => {
                                if (e.key === "Enter") {
                                    onCreatedFile!(newFile);
                                    setNewFile(null);
                                }
                            }}
                            onBlur={() => setNewFile(null)}
                        />
                    </span>
                )}
            </nav>
            <div className="flex flex-col flex-1 overflow-auto">
                <nav className="flex bg-[#383933] select-none">
                    {tabs.map(tab => (
                        <div key={"tab-" + tab} className={`color-[#c9d1d9] p-2 ${tab === file ? "bg-[#272822]" : ""}`} onClick={() => setFile(tab)}>
                            <FileIcon file={tab} />
                            {tab}
                            <span className="ml-2.5 cursor-pointer" onClick={() => {
                                const newTabs = tabs.filter(s => s !== tab);
                                setFile(newTabs[newTabs.length - 1] || null);
                                setTabs(tabs);
                            }}>
                                ×
                            </span>
                        </div>
                    ))}
                    <div className="flex-grow" />
                    <a className="text-[#c9d1d9] cursor-pointer no-underline p-2 inline-block" href="about:blank" target="output">Run</a>
                </nav>
                <CodeEditor
                    language={hasTab ? fileTypeLanguage(file) : "plain"}
                    value={hasTab ? files[file] : "Open a file to edit it."}
                    readOnly={!hasTab || readOnly}
                    onUpdate={value => file && onFileChange(file, value)}
                    tabSize={4}
                />
            </div>
            <iframe
                src="about:blank"
                className="flex-1 border-0 bg-white"
                name="output"
                onLoad={e => e.currentTarget.contentDocument && transpile(e.currentTarget.contentDocument, files)}
            />
        </div>
    );
}

declare namespace IDE {
    interface Props {
        files: Record<string, string>;
        readOnly?: boolean;
        children?: ReactNode;

        onFileChange?: (file: string, content: string) => void;
        onCreatedFile?: (file: string) => void;
        onDeletedFile?: (file: string) => void;
    }
}

export default IDE;