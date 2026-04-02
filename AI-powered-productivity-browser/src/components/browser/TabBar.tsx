import { useBrowserStore } from "../../store/browserStore";
import { useWorkspaceStore } from "../../store/workspaceStore";

export default function TabBar() {
  const activeWorkspaceId = useWorkspaceStore((state) => state.activeWorkspaceId);
  const { tabs, addTab, closeTab, setActiveTab } = useBrowserStore();
  const workspaceTabs = tabs.filter((tab) => tab.workspaceId === activeWorkspaceId);

  return (
    <div className="tabbar">
      {workspaceTabs.map((tab) => (
        <div
          key={tab.id}
          className={`tab ${tab.isActive ? "active" : ""}`}
          onClick={() => setActiveTab(tab.id)}
        >
          <span className="tab-title">{tab.title}</span>
          <button
            className="tab-close"
            onClick={(e) => {
              e.stopPropagation();
              closeTab(tab.id);
            }}
          >
            ✕
          </button>
        </div>
      ))}
      <button className="tab-add-btn" type="button" onClick={() => addTab(activeWorkspaceId)}>
        +
      </button>
    </div>
  );
}
