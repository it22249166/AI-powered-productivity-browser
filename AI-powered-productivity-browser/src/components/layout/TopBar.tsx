import TabBar from "../browser/TabBar";
import AddressBar from "../browser/AddressBar";

export default function TopBar() {
  return (
    <div className="topbar">
      <TabBar />
      <div className="toolbar-row">
        <div className="brand">Intentra</div>
        <AddressBar />
      </div>
    </div>
  );
}