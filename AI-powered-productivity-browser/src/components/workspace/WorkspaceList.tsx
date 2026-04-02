import { useBrowserStore } from "../../store/browserStore";
import { useWorkspaceStore } from "../../store/workspaceStore";

export default function WorkspaceList() {
  const { activeWorkspaceId, workspaces, addWorkspace, removeWorkspace, setActiveWorkspace } =
    useWorkspaceStore();
  const { closeWorkspaceTabs, ensureWorkspaceTab, tabs } = useBrowserStore();

  const handleAddWorkspace = () => {
    const workspaceId = addWorkspace();
    ensureWorkspaceTab(workspaceId);
  };

  const handleSelectWorkspace = (workspaceId: string) => {
    setActiveWorkspace(workspaceId);
    ensureWorkspaceTab(workspaceId);
  };

  const handleRemoveWorkspace = (workspaceId: string) => {
    closeWorkspaceTabs(workspaceId);
    removeWorkspace(workspaceId);
  };

  return (
    <div className="workspace-list">
      {workspaces.map((workspace) => {
        const tabCount = tabs.filter((tab) => tab.workspaceId === workspace.id).length;

        return (
          <button
            key={workspace.id}
            type="button"
            className={`workspace-item ${workspace.id === activeWorkspaceId ? "active" : ""}`}
            onClick={() => handleSelectWorkspace(workspace.id)}
          >
            <span>{workspace.name}</span>
            <span className="workspace-meta">{tabCount} tab{tabCount === 1 ? "" : "s"}</span>
            {workspaces.length > 1 ? (
              <span
                className="workspace-remove"
                onClick={(event) => {
                  event.stopPropagation();
                  handleRemoveWorkspace(workspace.id);
                }}
                aria-hidden="true"
              >
                ×
              </span>
            ) : null}
          </button>
        );
      })}
      <button type="button" className="workspace-create" onClick={handleAddWorkspace}>
        + New workspace
      </button>
    </div>
  );
}
