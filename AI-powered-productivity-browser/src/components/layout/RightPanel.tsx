import { useWorkspaceStore } from "../../store/workspaceStore";

export default function RightPanel() {
  const activeWorkspaceId = useWorkspaceStore((state) => state.activeWorkspaceId);
  const activeWorkspace = useWorkspaceStore((state) =>
    state.workspaces.find((workspace) => workspace.id === activeWorkspaceId)
  );
  const updateWorkspaceNotes = useWorkspaceStore((state) => state.updateWorkspaceNotes);

  return (
    <div className="sidebar-right">
      <h2 className="section-title">Notes</h2>
      <div className="card notes-header-card">
        <div className="notes-workspace-label">{activeWorkspace?.name || "Workspace"}</div>
        <p className="muted">Notes are saved per workspace so research stays grouped.</p>
      </div>
      <textarea
        className="notes-area"
        value={activeWorkspace?.notes || ""}
        onChange={(event) =>
          activeWorkspace && updateWorkspaceNotes(activeWorkspace.id, event.target.value)
        }
        placeholder="Write notes here..."
      />
    </div>
  );
}
