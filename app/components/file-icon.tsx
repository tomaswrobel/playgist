const extensions = new Map<string, [string, string]>([
    ["css", ["\ue805", "#42a5f5"]],
    ["tsx", ["\ue803", "#0288d1"]],
    ["jsx", ["\ue803", "#00bcd4"]],
    ["js", ["\ue804", "#ffca28"]],
    ["ts", ["\ue802", "#0288d1"]],
]);

function FileIcon(props: FileIcon.Props) {
    const [char, color] = extensions.get(props.file.split(".").pop()!) || ["\ue801", "yellow"];

    return (
        <span className="font-[fontello] inline-block antialiased mx-1" style={{color}}>
            {char}
        </span>
    )
}

declare namespace FileIcon {
    interface Props {
        file: string;
    }
}

export default FileIcon;