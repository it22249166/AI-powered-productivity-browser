import HistoryPanel from "../workspace/HistoryPanel";
import IntentPanel from "../workspace/IntentPanel";
import WorkspaceList from "../workspace/WorkspaceList";

export default function LeftSideBar() {
  return (
    <div className="sidebar-left">
      <div className="panel-heading sidebar-heading">
        <h2 className="section-title section-title-tight">Workspaces</h2>
      </div>
      <WorkspaceList />
      <div className="sidebar-section">
        <IntentPanel />
      </div>
      <HistoryPanel />
    </div>
  );
}
