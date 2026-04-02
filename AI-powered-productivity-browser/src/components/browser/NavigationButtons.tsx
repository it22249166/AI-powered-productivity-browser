import { useBrowserStore } from "../../store/browserStore";
import { useWorkspaceStore } from "../../store/workspaceStore";

export default function NavigationButtons() {
  const activeWorkspaceId = useWorkspaceStore((state) => state.activeWorkspaceId);
  const activeTab = useBrowserStore((state) =>
    state.tabs.find((tab) => tab.workspaceId === activeWorkspaceId && tab.isActive)
  );
  const requestNavigation = useBrowserStore((state) => state.requestNavigation);

  const disabled = !activeTab;

  return (
    <div className="nav-group">
      <button
        className="icon-btn"
        type="button"
        disabled={disabled || !activeTab?.canGoBack}
        onClick={() => activeTab && requestNavigation(activeTab.id, "back")}
        aria-label="Go back"
      >
        ←
      </button>
      <button
        className="icon-btn"
        type="button"
        disabled={disabled || !activeTab?.canGoForward}
        onClick={() => activeTab && requestNavigation(activeTab.id, "forward")}
        aria-label="Go forward"
      >
        →
      </button>
      <button
        className="icon-btn"
        type="button"
        disabled={disabled}
        onClick={() =>
          activeTab &&
          requestNavigation(activeTab.id, activeTab.isLoading ? "stop" : "reload")
        }
        aria-label={activeTab?.isLoading ? "Stop loading" : "Reload page"}
      >
        {activeTab?.isLoading ? "×" : "↻"}
      </button>
    </div>
  );
}
