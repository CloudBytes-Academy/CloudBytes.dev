function stripWrappingQuotes(value) {
    const v = String(value ?? "").trim();
    if (!v) return "";
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) return v.slice(1, -1);
    return v;
}

function extractFilename(meta) {
    const text = String(meta ?? "").trim();
    if (!text) return "";

    const match = text.match(/(?:^|\s)(?:filename|file|path|title)=("([^"]+)"|'([^']+)'|([^\s]+))/i);
    if (!match) return "";

    return stripWrappingQuotes(match[2] ?? match[3] ?? match[4] ?? "");
}

function walk(node, fn) {
    if (!node || typeof node !== "object") return;
    fn(node);
    const children = node.children;
    if (Array.isArray(children)) {
        for (const child of children) walk(child, fn);
    }
}

/**
 * Support ` ```lang filename="foo.py" ` style metadata.
 * We attach `data-filename` to the rendered `<pre>` so the client-side
 * code-block enhancer can render it in the header.
 */
export function remarkCodeBlockMeta() {
    return (tree) => {
        walk(tree, (node) => {
            if (node?.type !== "code") return;
            const filename = extractFilename(node.meta);
            if (!filename) return;

            node.data ||= {};
            node.data.hProperties ||= {};
            node.data.hProperties["data-filename"] = filename;
        });
    };
}

