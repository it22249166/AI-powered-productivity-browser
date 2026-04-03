import TabBar from "../browser/TabBar";
import AddressBar from "../browser/AddressBar";
import NavigationButtons from "../browser/NavigationButtons";
import { useWorkspaceStore } from "../../store/workspaceStore";
import { useRegionStore } from "../../store/regionStore";

type TopBarProps = {
  showLeftPanel: boolean;
  showRightPanel: boolean;
  showDashboard: boolean;
  onToggleLeftPanel: () => void;
  onToggleRightPanel: () => void;
  onToggleDashboard: () => void;
};

export default function TopBar({
  showLeftPanel,
  showRightPanel,
  showDashboard,
  onToggleLeftPanel,
  onToggleRightPanel,
  onToggleDashboard,
}: TopBarProps) {
  const activeWorkspaceId = useWorkspaceStore((state) => state.activeWorkspaceId);
  const activeWorkspace = useWorkspaceStore((state) =>
    state.workspaces.find((workspace) => workspace.id === activeWorkspaceId)
  );
  const searchRegion = useRegionStore((state) => state.searchRegion);
  const setSearchRegion = useRegionStore((state) => state.setSearchRegion);

  return (
    <div className="topbar">
      <TabBar />
      <div className="toolbar-row">
        <div className="brand">Intentra</div>
        <div className="topbar-status">
          <span className="topbar-status-dot" />
          <span>{activeWorkspace?.intent || "research"} mode</span>
        </div>
        <button
          type="button"
          className={`topbar-region ${searchRegion === "india" ? "active" : ""}`}
          onClick={() =>
            setSearchRegion(searchRegion === "india" ? "default" : "india")
          }
        >
          <span>{searchRegion === "india" ? "India Search" : "Default Search"}</span>
        </button>
        <div className="toolbar-tools">
          <button
            type="button"
            className={`toolbar-toggle ${showLeftPanel ? "active" : ""}`}
            onClick={onToggleLeftPanel}
          >
            Workspaces
          </button>
          <button
            type="button"
            className={`toolbar-toggle ${showDashboard ? "active" : ""}`}
            onClick={onToggleDashboard}
          >
            Workspace
          </button>
          <button
            type="button"
            className={`toolbar-toggle ${showRightPanel ? "active" : ""}`}
            onClick={onToggleRightPanel}
          >
            AI
          </button>
        </div>
        <NavigationButtons />
        <AddressBar />
      </div>
    </div>
  );
}
