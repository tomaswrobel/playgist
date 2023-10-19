import {readdir, readFile, } from "fs/promises";
import {join} from "path";

async function getLicense(path: string, dir: string) {
    path = join(path, dir);

    for (const license of ["LICENSE", "LICENSE.md", "LICENSE.txt", "license"]) {
        const text = await readFile(join(path, license), "utf-8").catch(() => null);

        if (text) {
            return `${dir}\n${text}\n\n`;
        }
    }

    return `${dir}\n\n`;
}

export async function GET() {
    const node_modules = join(process.cwd(), "node_modules");

    let text = "PlayGist" + await getLicense(process.cwd(), "");

    for (const dir of await readdir(node_modules)) {
        if (dir[0] === "@") {
            const path = join(node_modules, dir);
            for (const sub of await readdir(path)) {
                if (sub[0] === ".") {
                    continue;
                }
                text += dir + "/" + await getLicense(path, sub);
            }
        } else if (dir[0] !== ".") {
            text += await getLicense(node_modules, dir);
        }
    }

    return new Response(text.trim(), {
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
        },
    });
}