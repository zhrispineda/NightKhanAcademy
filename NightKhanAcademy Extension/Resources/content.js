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
        /* ELEMENTS 
        _fryalgi: Course challenge footer
        _6vli2nb: Course mastery highlight box
        */
        html, main, ._1v7bqtc2, #header-dropdown, #top-header-container, ._1dbhd502, ._fryalgi, ._6vli2nb {
            background-color: #121212 !important;
        }
      
        /* ELEMENTS 
        _xmj6ftz: Sidebar course header
        _1g9xbd8f: Sidebar course units
        _10q4fwvt: Course challenge box
        _1yg7xuga: Exercise hover box
        */
        .stp-animated-banner, ._158ir6wt, ._vmquk6f, #username-picker-container, .modal-footer, ._fss88w4, ._xmj6ftz, ._1g9xbd8f, ._10q4fwvt, ._1yg7xuga, ._pxfwtyj, ._1tvlo9eq {
            background-color: #191919 !important;
        }
      
        .user-info, .header-user-settings, ._lhvgag5, ._xmja1e8, ._xu2jcg, ._c53vsu1 {
            background-color: #1F1F1F !important;
        }
      
        /* Unit section border */
        ._c53vsu1 {
            border: solid 1px rgba(200,200,200,0.50) !important;
        }
      
        /* TEXT
        _1rhtxmd7: Course challenge title
        _19kv87av: Course challenge book icon
        _vn21y15: Course chellenge description
        _5nw48vg: Sidebar unit title
        _yutmpt: Course mastery unit title
        _pqblyia: Course mastery legend text
        _w6ztkyn: Course page title
        _1izjhmh9: Course challenge footer title
        _1fzwn6xn: Course challenge footer description
        _1bm1zjqm: Up next text
        _1tmst71o: Up next sparkle icon
        */
        h2, h3, h4, b, ._1h62wb2e, ._1ltrm5gv, ._1m7imn5w, ._9pl6rtj, ._1irdsj0v, ._167zy1df, ._1bkn1zo, ._7mb6uf5, ._136dqw5w, ._1h09evv, .badge-count, ._1ell7dku, ._1hl2debl, ._8ry3zep, ._1q0d09t, ._dwmetq, ._1rhtxmd7, ._19kv87av, ._vn21y15, ._5nw48vg, ._yutmpt, ._pqblyia, ._w6ztkyn, ._1izjhmh9, ._1fzwn6xn, ._1bm1zjqm, ._1tmst71o {
            color: #ffffff !important;
        }
      
        /* Selected/hyperlink text */
        ._eheaiue, ._1k43t9ye, ._x1h08ae, ._1ejvexq8, ._1nlxlc8a, .empty-field, ._i7xxeac {
            color: #1865F2 !important;
        }
      
        /* Sidebar bottom gradient */
        ._1t2avldr {
            background: linear-gradient(to bottom, transparent 0%, black 80%) !important;
        }
      
        /* Streak explanation bubble background */
        ._xv24cwj {
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
        console.log(`[NightKhanAcademy] Dark Mode is now ${darkModeEnabled ? "on" : "off"}`);
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
