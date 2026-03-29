import { useEffect, useRef } from "react";
import { useBrowserStore } from "../../store/browserStore";

export default function BrowserView() {
    const activeTab = useBrowserStore((state) =>
        state.tabs.find((tab) => tab.isActive)
    );

    const webviewRef = useRef<any>(null);

    useEffect(() => {
        const webview = webviewRef.current;
        if (!webview || !activeTab) return;

        const handleDidStartLoading = () => {
            console.log("Webview started loading:", activeTab.url);
        };

        const handleDidStopLoading = () => {
            console.log("Webview finished loading:", webview.getURL?.());
        };

        const handleDidFailLoad = (event: any) => {
            console.error("Webview failed to load:", event);
        };

        const handleDomReady = () => {
            console.log("Webview DOM ready");
        };

        webview.addEventListener("did-start-loading", handleDidStartLoading);
        webview.addEventListener("did-stop-loading", handleDidStopLoading);
        webview.addEventListener("did-fail-load", handleDidFailLoad);
        webview.addEventListener("dom-ready", handleDomReady);

        return () => {
            webview.removeEventListener("did-start-loading", handleDidStartLoading);
            webview.removeEventListener("did-stop-loading", handleDidStopLoading);
            webview.removeEventListener("did-fail-load", handleDidFailLoad);
            webview.removeEventListener("dom-ready", handleDomReady);
        };
    }, [activeTab]);

    if (!activeTab) {
        return <div className="browser-placeholder">No active tab</div>;
    }

    return (
        <div className="browser-view">
            <webview
                ref={webviewRef}
                key={activeTab.id}
                src={activeTab.url}
                style={{ width: "100%", height: "100%", display: "flex" }}
                allowpopups
            />
        </div>
    );
}