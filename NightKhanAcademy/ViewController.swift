//
//  ViewController.swift
//  NightKhanAcademy
//

import Cocoa
import SafariServices
import WebKit

let extensionBundleIdentifier = "com.example.NightKhanAcademy.Extension"

class ViewController: NSViewController, WKNavigationDelegate, WKScriptMessageHandler {

    @IBOutlet var webView: WKWebView!

    override func viewDidLoad() {
        super.viewDidLoad()

        webView.navigationDelegate = self
        webView.configuration.userContentController.add(self, name: "controller")

        guard let mainURL = Bundle.main.url(forResource: "Main", withExtension: "html"),
              let resourceURL = Bundle.main.resourceURL else { return }
        webView.loadFileURL(mainURL, allowingReadAccessTo: resourceURL)
    }

    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        SFSafariExtensionManager.getStateOfSafariExtension(withIdentifier: extensionBundleIdentifier) { state, error in
            guard let state, error == nil else { return }

            let useSettingsInsteadOfPreferences: Bool
            if #available(macOS 13, *) {
                useSettingsInsteadOfPreferences = true
            } else {
                useSettingsInsteadOfPreferences = false
            }

            DispatchQueue.main.async {
                webView.evaluateJavaScript("show(\(state.isEnabled), \(useSettingsInsteadOfPreferences))")
            }
        }
    }

    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        guard message.body as? String == "open-preferences" else { return }

        SFSafariApplication.showPreferencesForExtension(withIdentifier: extensionBundleIdentifier) { _ in
            DispatchQueue.main.async {
                NSApplication.shared.terminate(nil)
            }
        }
    }

}
