import { useBrowserStore } from "../../store/browserStore";

export default function BrowserView() {
  const activeTab = useBrowserStore((state) =>
    state.tabs.find((tab) => tab.isActive)
  );

  if (!activeTab) return null;

  return (
    <div className="h-full w-full">
      <webview
        src={activeTab.url}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}