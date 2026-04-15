import { liteClient as algoliasearch } from "algoliasearch/lite";

type Hit = Record<string, unknown> & { url?: string; title?: string; category?: string };

function escapeHtml(value: unknown) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function isTypingTarget(target: unknown) {
    return (
        target instanceof HTMLElement &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)
    );
}

function normalizeHref(url: string) {
    const cleaned = url.replace(/^\/+/, "").replace(/\/+$/, "");
    return `/${cleaned}/`;
}

function hitHtml(hit: Hit) {
    const rawUrl = typeof hit.url === "string" ? hit.url : "";
    const href = normalizeHref(rawUrl);
    const title = escapeHtml(typeof hit.title === "string" ? hit.title : "Untitled");
    const category = escapeHtml(typeof hit.category === "string" ? hit.category : "");

    return `
        <a class="cb-search-result" href="${href}">
          <span class="cb-search-result-title">${title}</span>
          ${category ? `<span class="cb-search-result-meta">${category}</span>` : ""}
        </a>
      `;
}

function renderHits(
    container: HTMLElement,
    hits: Hit[],
    options: { mode?: "replace" | "append"; showMore?: boolean } = {},
) {
    const mode = options.mode ?? "replace";
    const showMore = Boolean(options.showMore);

    if (mode === "replace") {
        container.innerHTML = "";
    } else {
        container.querySelector("[data-cb-search-more-wrap]")?.remove();
    }

    if (!hits.length && mode === "replace") {
        container.innerHTML = `<div class="px-4 py-3 text-sm text-base-content/70">No results</div>`;
        return;
    }

    if (hits.length) {
        container.insertAdjacentHTML("beforeend", hits.map(hitHtml).join(""));
    }

    if (showMore) {
        container.insertAdjacentHTML(
            "beforeend",
            `<div class="border-t border-base-300 p-2" data-cb-search-more-wrap>
              <button type="button" class="btn btn-ghost btn-sm w-full" data-cb-search-more>Load more</button>
            </div>`,
        );
    }
}

function setHidden(el: HTMLElement, hidden: boolean) {
    el.classList.toggle("hidden", hidden);
}

export function initSearchBar() {
    const root = document.querySelector("[data-cb-search]");
    if (!(root instanceof HTMLElement)) return;
    if (root.dataset.initialized === "true") return;
    root.dataset.initialized = "true";

    const placeholder = root.dataset.placeholder || "Search for bytes...";

    // Desktop
    const desktopInput = root.querySelector("[data-cb-search-desktop-input]");
    const desktopPanel = root.querySelector("[data-cb-search-desktop-panel]");
    const desktopResults = root.querySelector("[data-cb-search-desktop-results]");
    const desktopStatus = root.querySelector("[data-cb-search-desktop-status]");

    // Mobile
    const mobileOpen = root.querySelector("[data-cb-search-mobile-open]");
    const mobileBackdrop = root.querySelector("[data-cb-search-mobile-backdrop]");
    const mobileBar = root.querySelector("[data-cb-search-mobile-bar]");
    const mobileInput = root.querySelector("[data-cb-search-mobile-input]");
    const mobileClose = root.querySelector("[data-cb-search-mobile-close]");
    const mobileResults = root.querySelector("[data-cb-search-mobile-results]");
    const mobileStatus = root.querySelector("[data-cb-search-mobile-status]");

    const appId = import.meta.env.PUBLIC_ALGOLIA_APP_ID;
    const apiKey = import.meta.env.PUBLIC_ALGOLIA_SEARCH_API_KEY;
    const indexName = import.meta.env.PUBLIC_ALGOLIA_INDEX_NAME;

    const configured = Boolean(appId && apiKey && indexName);
    const client = configured ? algoliasearch(appId, apiKey) : null;

    const mdUp = () => window.matchMedia("(min-width: 768px)").matches;
    const hitsPerPage = 20;

    let debounceTimer: number | null = null;
    let lastRequest = 0;
    let prevOverflowHtml = "";
    let prevOverflowBody = "";

    const state = {
        desktop: { query: "", page: 0, nbPages: 0, nbHits: 0, shown: 0 },
        mobile: { query: "", page: 0, nbPages: 0, nbHits: 0, shown: 0 },
    };

    const showDesktopPanel = () => {
        if (!(desktopPanel instanceof HTMLElement)) return;
        setHidden(desktopPanel, false);
    };
    const hideDesktopPanel = () => {
        if (!(desktopPanel instanceof HTMLElement)) return;
        setHidden(desktopPanel, true);
    };

    const openMobile = () => {
        if (!(mobileBar instanceof HTMLElement) || !(mobileBackdrop instanceof HTMLElement)) return;
        setHidden(mobileBackdrop, false);
        setHidden(mobileBar, false);
        prevOverflowHtml = document.documentElement.style.overflow;
        prevOverflowBody = document.body.style.overflow;
        document.documentElement.style.overflow = "hidden";
        document.body.style.overflow = "hidden";
        window.setTimeout(() => {
            if (mobileInput instanceof HTMLInputElement) mobileInput.focus();
        }, 0);
    };

    const closeMobile = () => {
        if (mobileBackdrop instanceof HTMLElement) setHidden(mobileBackdrop, true);
        if (mobileBar instanceof HTMLElement) setHidden(mobileBar, true);
        document.documentElement.style.overflow = prevOverflowHtml;
        document.body.style.overflow = prevOverflowBody;

        if (mobileInput instanceof HTMLInputElement) mobileInput.value = "";
        if (mobileStatus instanceof HTMLElement) mobileStatus.textContent = "Type to search";
        if (mobileResults instanceof HTMLElement) mobileResults.innerHTML = "";
    };

    const setStatus = (where: "desktop" | "mobile", message: string) => {
        const el = where === "desktop" ? desktopStatus : mobileStatus;
        if (el instanceof HTMLElement) el.textContent = message;
    };

    const setResults = (where: "desktop" | "mobile", hits: Hit[]) => {
        const el = where === "desktop" ? desktopResults : mobileResults;
        if (!(el instanceof HTMLElement)) return;
        renderHits(el, hits);
    };

    const clearResults = (where: "desktop" | "mobile") => {
        const el = where === "desktop" ? desktopResults : mobileResults;
        if (el instanceof HTMLElement) el.innerHTML = "";
    };

    const setSummaryStatus = (where: "desktop" | "mobile") => {
        const s = state[where];
        if (!s.query) {
            setStatus(where, "Type to search");
            return;
        }
        if (!s.nbHits) {
            setStatus(where, "No results");
            return;
        }
        if (s.nbHits > s.shown) {
            setStatus(where, `Showing ${s.shown} of ${s.nbHits} results`);
            return;
        }
        setStatus(where, s.nbHits === 1 ? "1 result" : `${s.nbHits} results`);
    };

    const run = async (where: "desktop" | "mobile") => {
        const input = where === "desktop" ? desktopInput : mobileInput;
        if (!(input instanceof HTMLInputElement)) return;

        const query = input.value.trim();
        if (!query) {
            state[where] = { query: "", page: 0, nbPages: 0, nbHits: 0, shown: 0 };
            setStatus(where, "Type to search");
            clearResults(where);
            if (where === "desktop") hideDesktopPanel();
            return;
        }

        if (!configured || !client || !indexName) {
            setStatus(where, "Search is not configured");
            clearResults(where);
            if (where === "desktop") showDesktopPanel();
            return;
        }

        const requestId = ++lastRequest;
        setStatus(where, "Searching…");
        clearResults(where);
        if (where === "desktop") showDesktopPanel();

        try {
            const res = await client.searchForHits([{ indexName, params: { query, hitsPerPage, page: 0 } }]);
            if (requestId !== lastRequest) return;
            const result = res?.results?.[0];
            const hits = (result?.hits ?? []) as unknown as Hit[];
            const nbHits = typeof result?.nbHits === "number" ? result.nbHits : hits.length;
            const nbPages = typeof result?.nbPages === "number" ? result.nbPages : 0;
            const page = typeof result?.page === "number" ? result.page : 0;

            state[where] = { query, page, nbPages, nbHits, shown: hits.length };
            setSummaryStatus(where);

            const el = where === "desktop" ? desktopResults : mobileResults;
            if (el instanceof HTMLElement) {
                renderHits(el, hits, { mode: "replace", showMore: nbPages ? page < nbPages - 1 : false });
            }
        } catch (err) {
            if (requestId !== lastRequest) return;
            setStatus(where, "Search failed");
            clearResults(where);
            const el = where === "desktop" ? desktopResults : mobileResults;
            if (el instanceof HTMLElement) {
                el.innerHTML = `<div class="px-4 py-3 text-sm text-base-content/70">Try again in a moment.</div>`;
            }
            // eslint-disable-next-line no-console
            console.error("[search]", err);
        }
    };

    const loadMore = async (where: "desktop" | "mobile") => {
        const s = state[where];
        if (!s.query) return;
        if (!configured || !client || !indexName) return;
        if (!s.nbPages || s.page >= s.nbPages - 1) return;

        const requestId = ++lastRequest;
        const nextPage = s.page + 1;

        try {
            const res = await client.searchForHits([{ indexName, params: { query: s.query, hitsPerPage, page: nextPage } }]);
            if (requestId !== lastRequest) return;

            const result = res?.results?.[0];
            const hits = (result?.hits ?? []) as unknown as Hit[];
            const nbHits = typeof result?.nbHits === "number" ? result.nbHits : s.nbHits;
            const nbPages = typeof result?.nbPages === "number" ? result.nbPages : s.nbPages;

            state[where] = { query: s.query, page: nextPage, nbPages, nbHits, shown: s.shown + hits.length };
            setSummaryStatus(where);

            const el = where === "desktop" ? desktopResults : mobileResults;
            if (el instanceof HTMLElement) {
                renderHits(el, hits, { mode: "append", showMore: nbPages ? nextPage < nbPages - 1 : false });
            }
        } catch (err) {
            if (requestId !== lastRequest) return;
            setStatus(where, "Search failed");
            // eslint-disable-next-line no-console
            console.error("[search]", err);
        }
    };

    const onInput = (where: "desktop" | "mobile") => {
        if (debounceTimer) window.clearTimeout(debounceTimer);
        debounceTimer = window.setTimeout(() => void run(where), 120);
    };

    // Wire up desktop
    if (desktopInput instanceof HTMLInputElement) {
        desktopInput.placeholder ||= placeholder;
        desktopInput.addEventListener("input", () => onInput("desktop"));
        desktopInput.addEventListener("focus", () => {
            if (desktopInput.value.trim()) showDesktopPanel();
        });
        desktopInput.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                hideDesktopPanel();
                desktopInput.blur();
            }
        });
    }

    if (desktopResults instanceof HTMLElement) {
        desktopResults.addEventListener("click", (e) => {
            const target = e.target;
            if (!(target instanceof Element)) return;
            const btn = target.closest("[data-cb-search-more]");
            if (!(btn instanceof HTMLButtonElement)) return;
            e.preventDefault();
            btn.disabled = true;
            btn.textContent = "Loading…";
            void loadMore("desktop");
        });
    }

    // Close desktop panel when clicking outside
    document.addEventListener("click", (e) => {
        if (!(desktopPanel instanceof HTMLElement)) return;
        const target = e.target;
        if (!(target instanceof Node)) return;
        if (!root.contains(target)) hideDesktopPanel();
    });

    // Close panel after choosing a result
    if (desktopPanel instanceof HTMLElement) {
        desktopPanel.addEventListener("click", (e) => {
            const target = e.target;
            if (!(target instanceof Element)) return;
            const link = target.closest("a");
            if (link) hideDesktopPanel();
        });
    }

    // Wire up mobile
    if (mobileOpen instanceof HTMLButtonElement) {
        mobileOpen.disabled = !configured;
        mobileOpen.addEventListener("click", openMobile);
    }
    if (mobileClose instanceof HTMLButtonElement) mobileClose.addEventListener("click", closeMobile);
    if (mobileBackdrop instanceof HTMLElement) mobileBackdrop.addEventListener("click", closeMobile);

    if (mobileInput instanceof HTMLInputElement) {
        mobileInput.placeholder ||= placeholder;
        mobileInput.addEventListener("input", () => onInput("mobile"));
        mobileInput.addEventListener("keydown", (e) => {
            if (e.key === "Escape") closeMobile();
        });
    }

    if (mobileResults instanceof HTMLElement) {
        mobileResults.addEventListener("click", (e) => {
            const target = e.target;
            if (!(target instanceof Element)) return;
            const more = target.closest("[data-cb-search-more]");
            if (more instanceof HTMLButtonElement) {
                e.preventDefault();
                more.disabled = true;
                more.textContent = "Loading…";
                void loadMore("mobile");
                return;
            }
            const link = target.closest("a");
            if (link) closeMobile();
        });
    }

    // Global "/" shortcut
    if (document.documentElement.dataset.cbSearchShortcut !== "true") {
        document.documentElement.dataset.cbSearchShortcut = "true";
        document.addEventListener("keydown", (e) => {
            if (isTypingTarget(e.target)) return;
            if (e.key !== "/") return;
            e.preventDefault();

            if (mdUp() && desktopInput instanceof HTMLInputElement) {
                desktopInput.focus();
                if (desktopInput.value.trim()) showDesktopPanel();
                return;
            }
            openMobile();
        });
    }
}

