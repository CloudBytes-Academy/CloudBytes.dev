const copyToClipboardDefaultText = {
    innerText: "Copy",
    ariaLabel: "Copy to clipboard",
};
const copyToClipboardSuccessText = {
    innerText: "Copied!",
    ariaLabel: "Copied to clipboard",
};

// Get all pre elements but ignore line numbers section
document.querySelectorAll("div.highlight pre").forEach((snippet) => {
    // Create div.codecopy
    const wrapper = document.createElement("div");
    wrapper.classList.add("codecopy");

    // Wrap code inside div.codecopy
    const parent = snippet.parentNode;
    parent.replaceChild(wrapper, snippet);
    wrapper.appendChild(snippet);

    // Create button
    const button = document.createElement("button");
    button.classList.add("codecopy-btn");
    button.innerText = copyToClipboardDefaultText.innerText;
    button.setAttribute("aria-label", copyToClipboardDefaultText.ariaLabel);

    // Add button to div.codecopy, before the snippet
    wrapper.insertBefore(button, snippet);
});

// Add copy to clipboard functionality with trimmed content
const clipboard = new ClipboardJS(".codecopy-btn", {
    text: (trigger) => {
        const codeSnippet = trigger.nextElementSibling.innerText;
        return codeSnippet.trim(); // Trim leading and trailing newlines
    }
});

// Show message on success
clipboard.on("success", (e) => {
    e.trigger.innerText = copyToClipboardSuccessText.innerText;
    e.trigger.setAttribute("aria-label", copyToClipboardSuccessText.ariaLabel);
    e.clearSelection();

    // Reset button text
    setTimeout(() => {
        e.trigger.innerText = copyToClipboardDefaultText.innerText;
        e.trigger.setAttribute("aria-label", copyToClipboardDefaultText.ariaLabel);
    }, 400);
});