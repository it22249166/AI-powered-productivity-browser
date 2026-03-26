import { useBrowserStore } from "../../store/browserStore";

export default function BrowserView() {
  const activeTab = useBrowserStore((state) =>
    state.tabs.find((tab) => tab.isActive)
  );

  if (!activeTab) {
    return <div className="browser-placeholder">No active tab</div>;
  }

  return (
    <iframe
      key={activeTab.id}
      src={activeTab.url}
      title={activeTab.title}
      className="browser-view"
    />
  );
}