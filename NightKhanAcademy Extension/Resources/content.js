const LOG_PREFIX = "[NightKhanAcademy]";
const STORAGE_KEY = "DarkModeEnabled";
const TOGGLE_MARKER = "data-nightkhanacademy-toggle";

const ATTR = {
    background: "data-nka-bg",
    backgroundImage: "data-nka-bg-image",
    text: "data-nka-fg",
    border: "data-nka-border",
};

const DARK_MODE_CSS = `
    :root, [data-wb-theme] {
        --wb-semanticColor-core-background-base-default: #1E1E1E !important;
        --wb-semanticColor-core-background-base-subtle: #2A2A2A !important;
        --wb-semanticColor-core-background-neutral-subtle: #2A2A2A !important;
        --wb-semanticColor-core-background-instructive-subtle: #1B2A45 !important;
        --wb-semanticColor-core-foreground-neutral-strong: #EDEDED !important;
        --wb-semanticColor-core-foreground-neutral-default: #B3B3B3 !important;
        --wb-semanticColor-core-foreground-neutral-subtle: #8C8C8C !important;
        --wb-semanticColor-core-border-neutral-subtle: rgba(255, 255, 255, 0.18) !important;
        --wb-semanticColor-link-rest: #7FA8FF !important;
        --wb-semanticColor-link-hover: #A3C0FF !important;
        --wb-semanticColor-link-press: #A3C0FF !important;
    }

    html, body {
        background-color: #121212 !important;
        color-scheme: dark;
    }

    /* White surfaces (cards, panels, menus) */
    [${ATTR.background}="surface"] { background-color: #1E1E1E !important; }

    /* Off-white / tinted surfaces (sidebars, highlights, hover states) */
    [${ATTR.background}="subtle"] { background-color: #2A2A2A !important; }

    /* Light gradients, e.g. the fade at the bottom of the sidebar */
    [${ATTR.backgroundImage}] { background-image: none !important; }

    [${ATTR.text}="primary"] { color: #EDEDED !important; }
    [${ATTR.text}="secondary"] { color: #B3B3B3 !important; }

    [${ATTR.border}] { border-color: rgba(255, 255, 255, 0.18) !important; }

    /* Blue link/accent text, lightened for contrast on dark */
    [${ATTR.text}="accent"] { color: #7FA8FF !important; }
`;

const SKIPPED_TAGS = new Set(["IMG", "PICTURE", "VIDEO", "CANVAS", "IFRAME", "SVG", "STYLE", "SCRIPT"]);

// MARK: - Color helpers

function parseColor(value) {
    const parts = value.match(/[\d.]+/g);
    if (!parts || parts.length < 3) return null;
    const [r, g, b, a = 1] = parts.map(Number);
    return { r, g, b, a };
}

function luminance({ r, g, b }) {
    const channel = (c) => {
        c /= 255;
        return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function saturation({ r, g, b }) {
    return Math.max(r, g, b) - Math.min(r, g, b);
}

// MARK: - Tagging

function clearTags(element) {
    for (const name of Object.values(ATTR)) element.removeAttribute(name);
}

function tagElement(element) {
    if (SKIPPED_TAGS.has(element.tagName.toUpperCase()) || element.closest("svg")) return;
    if (element.hasAttribute(TOGGLE_MARKER)) return;

    const style = getComputedStyle(element);

    const background = parseColor(style.backgroundColor);
    if (background && background.a >= 0.5) {
        const lum = luminance(background);
        if (lum > 0.97) element.setAttribute(ATTR.background, "surface");
        else if (lum > 0.75) element.setAttribute(ATTR.background, "subtle");
    }

    if (/gradient\(.*rgba?\(2[3-5]\d, 2[3-5]\d, 2[3-5]\d/.test(style.backgroundImage)) {
        element.setAttribute(ATTR.backgroundImage, "");
    }

    const text = parseColor(style.color);
    if (text && text.a > 0) {
        const lum = luminance(text);
        if (lum < 0.3 && saturation(text) > 100) element.setAttribute(ATTR.text, "accent");
        else if (lum < 0.05) element.setAttribute(ATTR.text, "primary");
        else if (lum < 0.3) element.setAttribute(ATTR.text, "secondary");
    }

    const border = parseColor(style.borderTopColor);
    if (border && border.a > 0 && parseFloat(style.borderTopWidth) > 0 && luminance(border) < 0.3) {
        element.setAttribute(ATTR.border, "");
    }
}

function tagTree(root) {
    if (root.nodeType !== Node.ELEMENT_NODE) return;
    tagElement(root);
    for (const element of root.querySelectorAll("*")) tagElement(element);
}

// MARK: - Change tracking

const pendingRoots = new Set();
let frameRequested = false;

function queue(element) {
    pendingRoots.add(element);
    if (frameRequested) return;
    frameRequested = true;
    requestAnimationFrame(() => {
        frameRequested = false;
        const roots = [...pendingRoots];
        pendingRoots.clear();
        if (!isDarkModeEnabled()) return;
        for (const root of roots) {
            if (root.isConnected) tagTree(root);
        }
    });
}

function handleMutations(mutations) {
    for (const mutation of mutations) {
        if (mutation.type === "attributes") {
            clearTags(mutation.target);
            queue(mutation.target);
        } else {
            for (const node of mutation.addedNodes) {
                if (node.nodeType === Node.ELEMENT_NODE) queue(node);
            }
        }
    }
    
    if (styleElement && !styleElement.isConnected) {
        document.head.appendChild(styleElement);
    }
}

// MARK: - Dark mode

let styleElement = null;
let observer = null;

function isDarkModeEnabled() {
    return styleElement !== null;
}

function enableDarkMode() {
    if (isDarkModeEnabled()) return;

    styleElement = document.createElement("style");
    styleElement.textContent = DARK_MODE_CSS;
    document.head.appendChild(styleElement);

    tagTree(document.body);

    observer = new MutationObserver(handleMutations);
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["class", "style"],
    });

    localStorage.setItem(STORAGE_KEY, "true");
    console.log(`${LOG_PREFIX} Dark Mode on`);
}

function disableDarkMode() {
    observer?.disconnect();
    observer = null;
    styleElement?.remove();
    styleElement = null;

    const selector = Object.values(ATTR).map((name) => `[${name}]`).join(",");
    for (const element of document.querySelectorAll(selector)) clearTags(element);

    localStorage.setItem(STORAGE_KEY, "false");
    console.log(`${LOG_PREFIX} Dark Mode off`);
}

function toggleDarkMode() {
    isDarkModeEnabled() ? disableDarkMode() : enableDarkMode();
}

// MARK: - Menu toggle

function injectToggleButton() {
    if (document.querySelector(`[${TOGGLE_MARKER}]`)) return;

    const settingsLink = document.querySelector('a[href="/settings/account"]');
    const settingsListItem = settingsLink?.closest("li");
    if (!settingsListItem) return;

    const listItem = document.createElement("li");
    listItem.setAttribute(TOGGLE_MARKER, "");

    const anchor = document.createElement("a");
    anchor.className = settingsLink.className;
    anchor.href = "#";
    anchor.textContent = "Toggle Dark Mode";
    anchor.addEventListener("click", (event) => {
        event.preventDefault();
        toggleDarkMode();
    });

    listItem.appendChild(anchor);
    settingsListItem.after(listItem);
}

// MARK: - Startup

if (localStorage.getItem(STORAGE_KEY) === "true") {
    enableDarkMode();
}

new MutationObserver(injectToggleButton)
    .observe(document.body, { childList: true, subtree: true });
