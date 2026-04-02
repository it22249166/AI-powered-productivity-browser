import { useEffect, useState } from "react";
import { useBrowserStore } from "../../store/browserStore";
import { useWorkspaceStore } from "../../store/workspaceStore";

export default function AddressBar() {
  const activeWorkspaceId = useWorkspaceStore((state) => state.activeWorkspaceId);
  const { tabs, updateTabUrl } = useBrowserStore();
  const activeTab = tabs.find(
    (tab) => tab.workspaceId === activeWorkspaceId && tab.isActive
  );
  const [value, setValue] = useState(activeTab?.url || "");

  useEffect(() => {
    setValue(activeTab?.url || "");
  }, [activeTab]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTab) return;
    updateTabUrl(activeTab.id, value);
  };

  return (
    <form className="address-form" onSubmit={handleSubmit}>
      <input
        className="address-input"
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search or enter a website"
        spellCheck={false}
      />
    </form>
  );
}
