import {cookies} from "next/headers";

export function POST() {
    return fetch("https://api.github.com/user", {
        headers: {
            "Authorization": `Bearer ${cookies().get("token")}`
        }
    });
}