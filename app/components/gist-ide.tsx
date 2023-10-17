import IDE from "./ide";

function GistIDE(props: GistIDE.Props) {}

declare namespace GistIDE {
    interface Props {
        gist: string;
    }
}

export default GistIDE;