import { useEffect, useState } from "react";
import { useBrowserStore } from "../../store/browserStore";

export default function AddressBar() {
  const { tabs, updateTabUrl } = useBrowserStore();
  const activeTab = tabs.find((tab) => tab.isActive);
  const [value, setValue] = useState(activeTab?.url || "");

  useEffect(() => {
    setValue(activeTab?.url || "");
  }, [activeTab]);

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
    <form className="address-form" onSubmit={handleSubmit}>
      <input
        className="address-input"
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter URL..."
      />
    </form>
  );
}