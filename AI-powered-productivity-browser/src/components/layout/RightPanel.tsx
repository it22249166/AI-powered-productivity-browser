export default function RightPanel() {
  return (
    <div className="w-80 bg-zinc-950 border-l border-zinc-800 p-4 hidden lg:block">
      <h2 className="font-semibold mb-3">Notes</h2>
      <textarea
        className="w-full h-48 p-3 rounded-xl bg-zinc-900 resize-none outline-none"
        placeholder="Write notes here..."
      />
    </div>
  );
}