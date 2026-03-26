import TopBar from "./components/layout/TopBar";
import LeftSideBar from "./components/layout/LeftSideBar";
import RightPanel from "./components/layout/RightPanel";
import BrowserView from "./components/browser/BrowserView";

export default function App() {
  return (
    <div className="app-shell">
      <TopBar />
      <div className="main-layout">
        <LeftSideBar />
        <div className="browser-center">
          <BrowserView />
        </div>
        <RightPanel />
      </div>
    </div>
  );
}