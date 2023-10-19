import {transform} from "@babel/standalone";

const imports: Record<string, string> = {
    "npm/": "https://esm.sh/",
};

function cssModule(css: string) {
    return `document.head.appendChild(document.createElement("style")).textContent=${JSON.stringify(css)};export{};`;
}

function jsModule(js: string) {
    return URL.createObjectURL(
        new File(
            [js],
            "index.js",
            {type: "text/javascript"}
        )
    );
}

export function transpile(document: Document | null, files: Record<string, string>) {
    if (!document) {
        return;
    }

    release();
    
    for (const filename in files) {
        const content = files[filename];
        const ext = filename.slice(filename.lastIndexOf(".") + 1);

        if (["ts", "tsx", "js", "jsx"].indexOf(ext) > -1) {
            const presets = [];

            if (ext[0] === "t") {
                presets.push("typescript");
            }

            if (ext[2] === "x") {
                presets.push("react");
            }

            let js;

            try {
                js = transform(content, {
                    presets,
                    plugins: [
                        {
                            visitor: {
                                ImportDeclaration(path) {
                                    if (path.node.source.value.startsWith("./")) {
                                        path.node.source.value = path.node.source.value.replace("./", "local/");
                                    } else {
                                        path.node.source.value = `npm/${path.node.source.value}`;
                                    }
                                },
                            },
                        },
                    ],
                    filename,
                    minified: true,
                });

                if (!js) {
                    throw "Unknown error.";
                }
            } catch (e) {
                js = {
                    code: `throw ${JSON.stringify(String(e))};`
                };
            }

            imports[`local/${filename}`] = jsModule(js.code || "");
        } else if (ext === "css") {
            imports[`local/${filename}`] = jsModule(cssModule(content));
        }
    }

    switch (true) {
        case "local/index.ts" in imports:
            imports.init = jsModule('import "local/index.ts";');
            break;
        case "local/index.tsx" in imports:
            imports.init = jsModule('import "local/index.tsx";');
            break;
        case "local/index.js" in imports:
            imports.init = jsModule('import "local/index.js";');
            break;
        case "local/index.jsx" in imports:
            imports.init = jsModule('import "local/index.jsx";');
            break;
        default:
            imports.init = jsModule('throw "No entry point found. Try to create index.js, index.ts, index.jsx or index.tsx.";');
            break;
    }

    const importmap = document.createElement("script");
    importmap.type = "importmap";
    importmap.textContent = JSON.stringify({imports});
    document.head.appendChild(importmap);

    const script = document.createElement("script");
    script.textContent = '(async function () {\
        try {\
            await import("init");\
        } catch (e) {\
            frameElement.src = `/error?text=${encodeURIComponent(String(e))}`;\
        }\
    })();';

    document.body.appendChild(script);
}

export function release() {
    for (const src in imports) {
        if (src !== "npm/") {
            URL.revokeObjectURL(imports[src]);
            delete imports[src];
        }
    }
}