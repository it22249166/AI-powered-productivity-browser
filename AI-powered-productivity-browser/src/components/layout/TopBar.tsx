import TabBar from "../browser/TabBar";
import AddressBar from "../browser/AddressBar";
import NavigationButtons from "../browser/NavigationButtons";

export default function TopBar() {
  return (
    <div className="topbar">
      <TabBar />
      <div className="toolbar-row">
        <div className="brand">Intentra</div>
        <NavigationButtons />
        <AddressBar />
      </div>
    </div>
  );
}
