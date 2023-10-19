"use client";

import {useState, type ReactNode} from "react";
import fileTypeLanguage from "../utils/file-type";
import FileIcon from "./file-icon";
import {transpile} from "../utils/transpile";
import "../font/fontello.css";
import NavItem from "./nav-item";
import NavDivider from "./nav-divider";
import CodeEditor from "./code-editor";

function IDE({onCreatedFile, files, readOnly = false, children, onDeletedFile = () => {}, onFileChange = () => {}}: IDE.Props) {
    const [current, setCurrent] = useState<string | null>(null);
    const [tabs, setTabs] = useState<string[]>([]);
    const [newFile, setNewFile] = useState<string | null>(null);

    return (
        <div className="flex flex-grow h-screen w-screen font-sans">
            <nav suppressHydrationWarning className="flex bg-[#272922] flex-col m-0 p-0 overflow-x-hidden overflow-y-auto w-[200px] border-solid border-r border-[#00000026]">
                <NavItem href="https://github.com/tomas-wrobel/playgist">PlayGist on GitHub</NavItem>
                <NavDivider />
                {children}
                <a className="text-[#c9d1d9] cursor-pointer hover:bg-[#00000026] no-underline p-2.5 inline-block" onClick={() => {
                    setNewFile("");
                }}>New file...</a>
                <NavDivider />
                {Object.keys(files).map(file => (
                    <a key={"nav-" + file} className="text-[#c9d1d9] cursor-pointer hover:bg-[#00000026] no-underline p-2.5 inline-flex gap-2" onClick={() => {
                        if (tabs.indexOf(file) === -1) {
                            setTabs([...tabs, file]);
                        }
                        setCurrent(file);
                    }} title={file}>
                        <FileIcon file={file} />
                        <span className="text-ellipsis overflow-hidden whitespace-pre">
                            {file}
                        </span>
                        <div className="flex-grow" />
                        {readOnly || (
                            <span className="font-[fontello] inline-block antialiased" onClick={() => {
                                if (current === file) {
                                    setCurrent(null);
                                }
                                if (tabs.includes(file)) {
                                    setTabs(tabs.filter(s => s !== file));
                                }
                                onDeletedFile!(file);
                            }}>&#xe800;</span>
                        )}
                    </a>
                ))}
                {newFile === null || (
                    <form className="text-[#c9d1d9] no-underline p-2.5 inline-flex gap-2 items-center" onSubmit={e => {
                        e.preventDefault();
                        onCreatedFile!(newFile);
                        setTabs([...tabs, newFile]);
                        setCurrent(newFile);
                        setNewFile(null);
                    }}>
                        <FileIcon file={newFile} />
                        <input
                            required
                            name="file"
                            pattern="^[\w\-\.]+\.(css|[tj]sx?)$"
                            className="bg-[#383933] text-[#c9d1d9] text-sm border-0 outline-none rounded p-1 w-full"
                            autoFocus
                            placeholder="New file..."
                            value={newFile}
                            onChange={e => setNewFile(e.currentTarget.value)}
                            onKeyDown={e => {
                                if (e.key === "Escape") {
                                    setNewFile(null);
                                }
                            }}
                            onBlur={() => setNewFile(null)}
                        />
                    </form>
                )}
            </nav>
            <div className="flex flex-col flex-1 overflow-auto">
                <nav className="flex bg-[#383933] select-none">
                    {tabs.map(tab => (
                        <div key={"tab-" + tab} className={`text-[#c9d1d9] p-2 ${tab === current ? "bg-[#272822]" : ""}`} onClick={() => setCurrent(tab)}>
                            <FileIcon file={tab} />
                            {tab}
                            <span className="ml-2.5 cursor-pointer" onClick={e => {
                                e.stopPropagation();

                                const newTabs = tabs.filter(s => s !== tab);
                                setCurrent(newTabs[newTabs.length - 1] || null);
                                setTabs(newTabs);
                            }}>
                                ×
                            </span>
                        </div>
                    ))}
                    <div className="flex-grow" />
                    <a className="text-[#c9d1d9] cursor-pointer no-underline p-2 inline-block" href="about:blank" target="output">Run</a>
                </nav>
                <CodeEditor
                    language={current ? fileTypeLanguage(current) : "plain"}
                    code={current ? files[current] : ""}
                    readonly={!current || readOnly}
                    onChange={value => current && onFileChange(current, value)}
                />
            </div>
            <iframe
                name="output"
                className="flex-1 border-0 bg-white"
                onLoad={e => transpile(e.currentTarget.contentDocument, files)}
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