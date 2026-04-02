import WorkspaceList from "../workspace/WorkspaceList";

export default function LeftSideBar() {
  return (
    <div className="sidebar-left">
      <h2 className="section-title">Workspaces</h2>
      <WorkspaceList />
    </div>
  );
}
