import { useEffect, useRef } from "react";
import { useBrowserStore } from "../../store/browserStore";
import { useWorkspaceStore } from "../../store/workspaceStore";

export default function BrowserView() {
    const activeWorkspaceId = useWorkspaceStore((state) => state.activeWorkspaceId);
    const activeTab = useBrowserStore((state) =>
        state.tabs.find((tab) => tab.workspaceId === activeWorkspaceId && tab.isActive)
    );
    const updateTabState = useBrowserStore((state) => state.updateTabState);
    const ensureWorkspaceTab = useBrowserStore((state) => state.ensureWorkspaceTab);
    const navigationCommand = useBrowserStore((state) => state.navigationCommand);

    const webviewRef = useRef<any>(null);

    useEffect(() => {
        ensureWorkspaceTab(activeWorkspaceId);
    }, [activeWorkspaceId, ensureWorkspaceTab]);

    useEffect(() => {
        const webview = webviewRef.current;
        if (!webview || !activeTab) return;

        const syncNavigationState = () => {
            updateTabState(activeTab.id, {
                url: webview.getURL?.() || activeTab.url,
                title: webview.getTitle?.() || activeTab.title,
                canGoBack: webview.canGoBack?.() || false,
                canGoForward: webview.canGoForward?.() || false,
            });
        };

        const handleDidStartLoading = () => {
            updateTabState(activeTab.id, {
                isLoading: true,
            });
        };

        const handleDidStopLoading = () => {
            updateTabState(activeTab.id, {
                isLoading: false,
            });
            syncNavigationState();
        };

        const handleDidFailLoad = (event: any) => {
            updateTabState(activeTab.id, {
                isLoading: false,
                title: event.errorDescription || "Page failed to load",
            });
        };

        const handleDomReady = () => {
            syncNavigationState();
        };

        const handlePageTitleUpdated = (event: Event) => {
            const nextTitle = (event as CustomEvent<{ title?: string }>).detail?.title;
            updateTabState(activeTab.id, {
                title: nextTitle || webview.getTitle?.() || activeTab.title,
            });
        };

        const handleDidNavigate = () => {
            syncNavigationState();
        };

        webview.addEventListener("did-start-loading", handleDidStartLoading);
        webview.addEventListener("did-stop-loading", handleDidStopLoading);
        webview.addEventListener("did-fail-load", handleDidFailLoad);
        webview.addEventListener("dom-ready", handleDomReady);
        webview.addEventListener("page-title-updated", handlePageTitleUpdated);
        webview.addEventListener("did-navigate", handleDidNavigate);
        webview.addEventListener("did-navigate-in-page", handleDidNavigate);

        return () => {
            webview.removeEventListener("did-start-loading", handleDidStartLoading);
            webview.removeEventListener("did-stop-loading", handleDidStopLoading);
            webview.removeEventListener("did-fail-load", handleDidFailLoad);
            webview.removeEventListener("dom-ready", handleDomReady);
            webview.removeEventListener("page-title-updated", handlePageTitleUpdated);
            webview.removeEventListener("did-navigate", handleDidNavigate);
            webview.removeEventListener("did-navigate-in-page", handleDidNavigate);
        };
    }, [activeTab, updateTabState]);

    useEffect(() => {
        const webview = webviewRef.current;
        if (!webview || !activeTab || !navigationCommand || navigationCommand.tabId !== activeTab.id) {
            return;
        }

        if (navigationCommand.action === "back" && webview.canGoBack?.()) {
            webview.goBack();
        }

        if (navigationCommand.action === "forward" && webview.canGoForward?.()) {
            webview.goForward();
        }

        if (navigationCommand.action === "reload") {
            webview.reload();
        }

        if (navigationCommand.action === "stop") {
            webview.stop();
            updateTabState(activeTab.id, { isLoading: false });
        }
    }, [activeTab, navigationCommand, updateTabState]);

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
