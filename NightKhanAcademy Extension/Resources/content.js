console.log("NightKhanAcademy has arrived");

let darkModeEnabled = false;
let style = null;
let observer = null;
localStorage.getItem("DarkModeEnabled") == "true" ? darkModeEnabled = true: darkModeEnabled = false;
console.log(`[NightKhanAcademy] Dark Mode is currently ${darkModeEnabled ? "on" : "off"}`);

if (darkModeEnabled) {
    injectDarkMode();
}

function injectDarkMode() {
    style = document.createElement('style');
    style.textContent = `
        /* Base backgrounds and elements */
        html, main, ._1v7bqtc2, #header-dropdown, #top-header-container, .user-info, ._1dbhd502 {
            background-color: #121212 !important;
        }
      
        .stp-animated-banner, ._158ir6wt, ._vmquk6f {
            background-color: #232323 !important;
        }
      
        /* Texts to update for dark mode */
        h2, h4, b, ._1h62wb2e, ._1ltrm5gv, ._1m7imn5w, ._9pl6rtj, ._1irdsj0v, ._167zy1df, ._1bkn1zo, ._7mb6uf5, ._136dqw5w, ._1h09evv, .badge-count, ._1ell7dku, ._1hl2debl, ._8ry3zep {
            color: #FFFFFF !important;
        }
      
        /* Selected text */
        ._eheaiue, ._1k43t9ye, ._x1h08ae, ._1ejvexq8, ._1nlxlc8a {
            color: #1865F2 !important;
        }
      
        /* Streak explanation bubble background, level explanation bubble background */
        ._xv24cwj, ._xu2jcg {
            background-color: #121212 !important;
        }
      `;
    document.head.appendChild(style);
    console.log("[NightKhanAcademy] Injected Dark Mode!")
    
    // Watch for DOM changes
    observer = new MutationObserver(() => {
        if (!document.head.contains(style)) {
            document.head.appendChild(style);
        }
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
    
    darkModeEnabled = true
    localStorage.setItem("DarkModeEnabled", "true");
}

function ejectDarkMode() {
    if (observer) {
        observer.disconnect();
        observer = null;
    }
    if (style) {
        style.remove();
        style = null;
    }
    
    darkModeEnabled = false;
    localStorage.setItem("DarkModeEnabled", "false");
    console.log("[NightKhanAcademy] Ejected Dark Mode!");
}

function injectToggleButton() {
    // Find the dropdown Settings button using its href value
    const settingsButton = document.querySelector('a[href="/settings/account"]');
    
    if (!settingsButton) {
        console.log("[NightKhanAcademy] Could not find Settings button!");
        return;
    } else if (document.querySelector('[toggle-button-injected="true"]')) {
        return;
    }
    
    const listItem = document.createElement("li");
    listItem.setAttribute("toggle-button-injected", "true");
    
    const anchor = document.createElement("a");
    anchor.className = "_v7zs5hu _p8zr6r"; // Match <a> style of dropdown buttons
    
    const span = document.createElement("span");
    span.className = "_i7xxeac"; // Match <span> style of dropdown buttons
    span.textContent = "Toggle Dark Mode";
    
    anchor.appendChild(span);
    anchor.addEventListener("click", (e) => {
        if (darkModeEnabled == false) {
            injectDarkMode();
        } else {
            ejectDarkMode();
        }
        console.log("[NightKhanAcademy] Dark Mode is now " + (darkModeEnabled == true ? "on" : "off"));
    });
    
    listItem.appendChild(anchor);
    
    const settingsListItem = settingsButton.closest("li");
    if (settingsListItem && settingsListItem.parentElement) {
        settingsListItem.insertAdjacentElement("afterend", listItem);
        console.log("[NightKhanAcademy] Added toggle under Settings button");
    }
}

// Watch for DOM changes
if (!window.__toggleObserverInitialized) {
    window.__toggleObserverInitialized = true;
    
    new MutationObserver(() => injectToggleButton())
    .observe(document.body, { childList: true, subtree: true });
}
