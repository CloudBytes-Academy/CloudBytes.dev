function collectText(node) {
    if (!node) return "";
    if (node.type === "text") return String(node.value ?? "");
    if (Array.isArray(node.children)) return node.children.map(collectText).join("");
    return "";
}

/**
 * Pelican content uses a standalone `[TOC]` marker. Strip it so we can render a real TOC in the layout.
 */
export function remarkStripPelicanToc() {
    return (tree) => {
        if (!tree || !Array.isArray(tree.children)) return;
        tree.children = tree.children.filter((node) => {
            if (node?.type !== "paragraph") return true;
            const text = collectText(node).trim().toLowerCase();
            return text !== "[toc]";
        });
    };
}

