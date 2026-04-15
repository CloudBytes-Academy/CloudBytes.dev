function collectText(node) {
    if (!node) return "";
    if (node.type === "text") return String(node.value ?? "");
    if (!Array.isArray(node.children)) return "";
    return node.children.map(collectText).join("");
}

function stripWrappingQuotes(input) {
    const s = String(input ?? "").trim();
    if (!s) return "";

    // Handle straight + curly quotes (common after Pelican conversions)
    const quoteChars = ['"', "“", "”", "‘", "’", "'"];
    let out = s;
    while (out && quoteChars.includes(out[0])) out = out.slice(1).trimStart();
    while (out && quoteChars.includes(out[out.length - 1])) out = out.slice(0, -1).trimEnd();
    return out;
}

function titleForKind(kind) {
    const k = String(kind || "note").toLowerCase();
    if (k === "tip") return "Tip";
    if (k === "warning") return "Warning";
    if (k === "danger" || k === "error") return "Danger";
    if (k === "important") return "Important";
    if (k === "info") return "Info";
    return "Note";
}

function classForKind(kind) {
    const k = String(kind || "note").toLowerCase();
    if (k === "tip") return "tip";
    if (k === "warning") return "warning";
    if (k === "danger" || k === "error") return "danger";
    if (k === "important") return "important";
    if (k === "info") return "info";
    return "note";
}

function parseAdmonition(text) {
    const raw = String(text ?? "").trim();
    const match = raw.match(/^\s*!!!\s*([a-zA-Z0-9_-]+)\s*(.*)$/);
    if (!match) return null;
    return {
        kindRaw: match[1],
        rest: stripWrappingQuotes(match[2]),
    };
}

function makeElement(tagName, classNames, children = []) {
    return {
        type: "element",
        tagName,
        properties: classNames?.length ? { className: classNames } : {},
        children,
    };
}

function makeText(value) {
    return { type: "text", value: String(value ?? "") };
}

function makeAdmonition(kindRaw, rest, extraChildren = []) {
    const kindClass = classForKind(kindRaw);
    const title = titleForKind(kindRaw);

    const bodyChildren = [];
    if (rest) bodyChildren.push(makeElement("p", [], [makeText(rest)]));
    bodyChildren.push(...extraChildren);

    return makeElement("div", ["cb-admonition", `cb-admonition-${kindClass}`], [
        makeElement("div", ["cb-admonition-title"], [makeText(title)]),
        makeElement("div", ["cb-admonition-content"], bodyChildren),
    ]);
}

/**
 * Rehype transform for admonitions that slipped through as:
 * - <blockquote><p>!!! warning "..."</p></blockquote>
 * - <p>!!! note "..."</p>
 */
export function rehypePelicanAdmonitions() {
    const transformChildren = (parent) => {
        if (!parent || !Array.isArray(parent.children)) return;

        parent.children = parent.children.map((node) => {
            if (!node || node.type !== "element") return node;

            // Convert blockquote admonitions
            if (node.tagName === "blockquote" && Array.isArray(node.children) && node.children.length) {
                const first = node.children.find((c) => c?.type === "element");
                if (first?.type === "element" && first.tagName === "p") {
                    const parsed = parseAdmonition(collectText(first));
                    if (parsed) {
                        const extra = node.children
                            .filter((c, idx) => idx !== node.children.indexOf(first))
                            .filter(Boolean);
                        return makeAdmonition(parsed.kindRaw, parsed.rest, extra);
                    }
                }
            }

            // Convert plain paragraph admonitions (non-blockquote)
            if (node.tagName === "p") {
                const parsed = parseAdmonition(collectText(node));
                if (parsed) return makeAdmonition(parsed.kindRaw, parsed.rest);
            }

            transformChildren(node);
            return node;
        });
    };

    return (tree) => {
        transformChildren(tree);
    };
}

