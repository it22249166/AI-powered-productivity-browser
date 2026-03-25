import AddressBar from "../browser/AddressBar";
import TabBar from "../browser/TabBar";

export default function TopBar() {
  return (
    <div className="border-b border-zinc-800 bg-zinc-950">
      <TabBar />
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="font-bold text-blue-500">Intentra</div>
        <AddressBar />
      </div>
    </div>
  );
}