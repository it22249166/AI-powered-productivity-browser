export default function LeftSidebar() {
  return (
    <div className="w-64 bg-zinc-950 border-r border-zinc-800 p-4 hidden md:block">
      <h2 className="font-semibold mb-3">Workspaces</h2>
      <div className="space-y-2">
        <div className="p-3 rounded-xl bg-zinc-900">General</div>
        <div className="p-3 rounded-xl bg-zinc-900">Study</div>
      </div>
    </div>
  );
}