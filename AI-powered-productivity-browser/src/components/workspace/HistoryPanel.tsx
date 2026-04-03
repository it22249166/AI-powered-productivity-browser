import { useBrowserStore } from "../../store/browserStore";
import { useWorkspaceStore } from "../../store/workspaceStore";

const formatTime = (timestamp: number) =>
  new Date(timestamp).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

export default function HistoryPanel() {
  const activeWorkspaceId = useWorkspaceStore((state) => state.activeWorkspaceId);
  const activeWorkspace = useWorkspaceStore((state) =>
    state.workspaces.find((workspace) => workspace.id === activeWorkspaceId)
  );
  const tabs = useBrowserStore((state) => state.tabs);
  const updateTabUrl = useBrowserStore((state) => state.updateTabUrl);

  const activeTab = tabs.find((tab) => tab.workspaceId === activeWorkspaceId && tab.isActive);

  if (!activeWorkspace) {
    return null;
  }

  return (
    <div className="card sidebar-section">
      <div className="panel-heading sidebar-heading">
        <h3 className="section-title section-title-tight">Recent Pages</h3>
        <span className="status-chip">{activeWorkspace.history.length}</span>
      </div>
      <div className="history-list">
        {activeWorkspace.history.length === 0 ? (
          <div className="card-muted">Your recent pages in this workspace will appear here.</div>
        ) : (
          activeWorkspace.history.map((entry) => (
            <button
              key={entry.id}
              type="button"
              className="history-item"
              onClick={() => activeTab && updateTabUrl(activeTab.id, entry.url)}
            >
              <strong>{entry.title || entry.url}</strong>
              <span>{entry.url}</span>
              <small>{formatTime(entry.visitedAt)}</small>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
