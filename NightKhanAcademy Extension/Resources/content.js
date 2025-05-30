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
        _a4dcxhc: Unit practice box
        */
        html, main, ._1v7bqtc2, #header-dropdown, #top-header-container, ._1dbhd502, ._fryalgi, ._6vli2nb, ._a4dcxhc {
            background-color: #121212 !important;
        }
      
        /* ELEMENTS 
        _xmj6ftz: Sidebar course header
        _1g9xbd8f: Sidebar course units
        _10q4fwvt: Course challenge box
        _1yg7xuga: Exercise hover box
        _joa76hj: Streak week hover box
        _2qe0as: Unit section
        _rflrqt: Quiz challenge box
        _162gowz9: Highlighted unit section
        _1solqon7, _7thghm: Unit description box
        */
        .stp-animated-banner, ._158ir6wt, ._vmquk6f, #username-picker-container, .modal-footer, ._fss88w4, ._xmj6ftz, ._1g9xbd8f, ._10q4fwvt, ._1yg7xuga, ._pxfwtyj, ._1tvlo9eq, ._joa76hj, ._2qe0as, ._rflrqt, ._162gowz9, ._1solqon7, ._7thghm {
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
        _6v6ik2n: Course mastery unit missing explanation
        _7rlsjk: Welcome course title
        _1xxbrjb: Welcome course description
        _93y654b: Streak bubble text
        _e7vc6cd: Streak week bubble text
        _1cmrgu7g: Streak progress information title
        _hgszivt: Streak progress information text
        _97t3tls: Streak level skills progress text
        _b6fxohx: Quiz challenge box text
        _1qps80rt: Unit section title
        _3x1qmdh: Mastery status text
        _1n1r9lt7: Practice text
        _rpbeml: Unit description text
        _oa7jvj7: Practice status text
        */
        h2, h3, h4, b, ._1h62wb2e, ._1ltrm5gv, ._1m7imn5w, ._9pl6rtj, ._1irdsj0v, ._167zy1df, ._1bkn1zo, ._7mb6uf5, ._136dqw5w, ._1h09evv, .badge-count, ._1ell7dku, ._1hl2debl, ._8ry3zep, ._1q0d09t, ._dwmetq, ._1rhtxmd7, ._19kv87av, ._vn21y15, ._5nw48vg, ._yutmpt, ._pqblyia, ._w6ztkyn, ._1izjhmh9, ._1fzwn6xn, ._1bm1zjqm, ._1tmst71o, ._7rlsjk, ._1xxbrjb, ._6v6ik2n, ._93y654b, ._e7vc6cd, ._hgszivt, ._1cmrgu7g, ._97t3tls, ._b6fxohx, ._1qps80rt, ._3x1qmdh, ._1n1r9lt7, ._rpbeml, ._oa7jvj7 {
            color: #ffffff !important;
        }
      
        /* Course mastery boxes */
        ._6vli2nb, ._1xyf4qti {
            border-bottom: 1px solid rgba(255,255,255,0.5) !important;
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
