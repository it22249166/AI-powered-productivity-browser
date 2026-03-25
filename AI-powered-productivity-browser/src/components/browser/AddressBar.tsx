import { useState } from "react";
import { useBrowserStore } from "../../store/browserStore";

export default function AddressBar() {
  const { tabs, updateTabUrl } = useBrowserStore();
  const activeTab = tabs.find((tab) => tab.isActive);
  const [value, setValue] = useState(activeTab?.url || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTab) return;

    const formatted =
      value.startsWith("http://") || value.startsWith("https://")
        ? value
        : `https://${value}`;

    updateTabUrl(activeTab.id, formatted);
  };

  return (
    <form onSubmit={handleSubmit} className="flex-1">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full px-4 py-2 rounded-xl bg-zinc-800 text-white outline-none"
        placeholder="Enter URL..."
      />
    </form>
  );
}