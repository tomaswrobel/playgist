import type {AnchorHTMLAttributes, DetailedHTMLProps} from "react";

export default function NavItem(props: DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>) {
    return (
        <a {...props} className={`text-[#c9d1d9] cursor-pointer hover:bg-[#00000026] no-underline p-2.5 inline-block ${props.className || ""}`}>
            {props.children}
        </a>
    );
}