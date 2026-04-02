import { useState } from "react";
import TopBar from "./components/layout/TopBar";
import LeftSideBar from "./components/layout/LeftSideBar";
import RightPanel from "./components/layout/RightPanel";
import BrowserView from "./components/browser/BrowserView";
import WorkspaceDashboard from "./components/workspace/WorkspaceDashboard";
import { useWorkspaceStore } from "./store/workspaceStore";

export default function App() {
  const [showLeftPanel, setShowLeftPanel] = useState(false);
  const [showRightPanel, setShowRightPanel] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const activeWorkspaceId = useWorkspaceStore((state) => state.activeWorkspaceId);
  const activeWorkspace = useWorkspaceStore((state) =>
    state.workspaces.find((workspace) => workspace.id === activeWorkspaceId)
  );

  return (
    <div className="app-shell">
      <TopBar
        showLeftPanel={showLeftPanel}
        showRightPanel={showRightPanel}
        showDashboard={showDashboard}
        onToggleLeftPanel={() => setShowLeftPanel((value) => !value)}
        onToggleRightPanel={() => setShowRightPanel((value) => !value)}
        onToggleDashboard={() => setShowDashboard((value) => !value)}
      />
      <div className="main-layout">
        {showLeftPanel ? <LeftSideBar /> : null}
        <div className="browser-center">
          <div className="browse-first-banner">
            <div>
              <div className="browse-first-title">{activeWorkspace?.name || "Workspace"}</div>
              <div className="browse-first-subtitle">
                {activeWorkspace?.intent || "research"} mode
              </div>
            </div>
            <button
              type="button"
              className="ghost-action-btn browse-first-btn"
              onClick={() => setShowDashboard((value) => !value)}
            >
              {showDashboard ? "Hide workspace tools" : "Show workspace tools"}
            </button>
          </div>
          {showDashboard ? <WorkspaceDashboard /> : null}
          <div className="browser-stage">
            <BrowserView />
          </div>
        </div>
        {showRightPanel ? <RightPanel /> : null}
      </div>
    </div>
  );
}
