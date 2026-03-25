import TopBar from "./components/layout/TopBar";
import LeftSidebar from "./components/layout/LeftSidebar";
import RightPanel from "./components/layout/RightPanel";
import BrowserView from "./components/browser/BrowserView";

export default function App() {
  return (
    <div className="h-screen bg-black text-white flex flex-col">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <LeftSidebar />
        <div className="flex-1 bg-zinc-950">
          <BrowserView />
        </div>
        <RightPanel />
      </div>
    </div>
  );
}