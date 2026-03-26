import { useBrowserStore } from "../../store/browserStore";

export default function TabBar() {
  const { tabs, addTab, closeTab, setActiveTab } = useBrowserStore();

  return (
    <div className="tabbar">
      {tabs.map((tab) => (
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
      <button className="tab-add-btn" onClick={addTab}>
        +
      </button>
    </div>
  );
}