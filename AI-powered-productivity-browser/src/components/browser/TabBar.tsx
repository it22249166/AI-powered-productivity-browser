import { useBrowserStore } from "../../store/browserStore";

export default function TabBar() {
  const { tabs, addTab, closeTab, setActiveTab } = useBrowserStore();

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-zinc-900 border-b border-zinc-800 overflow-x-auto">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer min-w-[180px] ${
            tab.isActive ? "bg-blue-600" : "bg-zinc-800"
          }`}
        >
          <span className="truncate flex-1">{tab.title}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeTab(tab.id);
            }}
            className="text-sm"
          >
            ✕
          </button>
        </div>
      ))}
      <button
        onClick={addTab}
        className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700"
      >
        +
      </button>
    </div>
  );
}