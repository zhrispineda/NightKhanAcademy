console.log("NightKhanAcademy has arrived");

let darkModeEnabled = false;
localStorage.getItem("DarkModeEnabled") == "true" ? darkModeEnabled = true: darkModeEnabled = false;
console.log("[NightKhanAcademy] Dark Mode is currently " + (darkModeEnabled == true ? "on" : "off"));

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
    anchor.href = "#";
    anchor.className = "_v7zs5hu _p8zr6r"; // Match <a> style of dropdown buttons
    
    const span = document.createElement("span");
    span.className = "_1k43t9ye"; // Match <span> style of dropdown buttons
    span.textContent = "Toggle Dark Mode";
    
    anchor.appendChild(span);
    anchor.addEventListener("click", (e) => {
        if (darkModeEnabled == false) {
            darkModeEnabled = true
            localStorage.setItem("DarkModeEnabled", "true");
        } else {
            darkModeEnabled = false
            localStorage.setItem("DarkModeEnabled", "false");
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
