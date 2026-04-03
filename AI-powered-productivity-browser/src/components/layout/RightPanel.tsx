import { useMemo, useState } from "react";
import { useWorkspaceStore } from "../../store/workspaceStore";
import { useBrowserStore } from "../../store/browserStore";
import { buildCitationDraft, runAssistantAction } from "../../utils/workspaceAssistant";

const summarizeHost = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
};

export default function RightPanel() {
  const [selectedAction, setSelectedAction] = useState("Explain simply");
  const [showMore, setShowMore] = useState(false);
  const activeWorkspaceId = useWorkspaceStore((state) => state.activeWorkspaceId);
  const activeWorkspace = useWorkspaceStore((state) =>
    state.workspaces.find((workspace) => workspace.id === activeWorkspaceId)
  );
  const updateWorkspaceNotes = useWorkspaceStore((state) => state.updateWorkspaceNotes);
  const appendWorkspaceNotes = useWorkspaceStore((state) => state.appendWorkspaceNotes);
  const addSavedSource = useWorkspaceStore((state) => state.addSavedSource);
  const addTasks = useWorkspaceStore((state) => state.addTasks);
  const setAssistantResult = useWorkspaceStore((state) => state.setAssistantResult);
  const activeTab = useBrowserStore((state) =>
    state.tabs.find((tab) => tab.workspaceId === activeWorkspaceId && tab.isActive)
  );

  const aiSummary = activeTab
    ? `This page from ${summarizeHost(activeTab.url)} looks relevant for ${
        activeWorkspace?.intent || "work"
      }. Save it if it supports your goal, then turn the useful parts into notes or action items.`
    : "Open a page to generate an AI summary, extract tasks, and ask follow-up questions.";
  const quickActions = ["Explain simply", "Summarize", "Extract tasks", "Create notes"];
  const actionFeedback = useMemo(() => {
    if (!activeTab) {
      return "Choose a quick action after opening a page.";
    }

    if (activeWorkspace?.assistantResult?.actionLabel === selectedAction) {
      return activeWorkspace.assistantResult.content;
    }

    return `${selectedAction} is prepared for ${activeTab.title || summarizeHost(activeTab.url)}. The result can feed notes, tasks, or your research board.`;
  }, [activeTab, activeWorkspace?.assistantResult, selectedAction]);

  const runAction = (action: string) => {
    if (!activeWorkspace) {
      return;
    }

    setSelectedAction(action);
    const outcome = runAssistantAction(action, activeWorkspace, activeTab);
    setAssistantResult(activeWorkspace.id, outcome.result);

    if (outcome.suggestedNotes) {
      appendWorkspaceNotes(activeWorkspace.id, outcome.suggestedNotes);
    }

    if (outcome.suggestedTasks?.length) {
      addTasks(activeWorkspace.id, outcome.suggestedTasks);
    }

    if (outcome.suggestedSourceNote && activeTab) {
      addSavedSource(activeWorkspace.id, {
        title: activeTab.title || "Untitled source",
        url: activeTab.url,
        note: outcome.suggestedSourceNote,
      });
    }
  };

  return (
    <div className="sidebar-right">
      <h2 className="section-title">AI Copilot</h2>
      <div className="card notes-header-card">
        <div className="notes-workspace-label">Ask the Page</div>
        <p className="muted">{aiSummary}</p>
        <div className="prompt-grid quick-action-grid">
          {quickActions.map((action) => (
            <button
              key={action}
              type="button"
              className={`prompt-chip ${selectedAction === action ? "active" : ""}`}
              onClick={() => runAction(action)}
            >
              {action}
            </button>
          ))}
        </div>
        <div className="assistant-preview">
          <div className="assistant-preview-label">Copilot status</div>
          <p>{actionFeedback}</p>
        </div>
      </div>
      <button type="button" className="ghost-action-btn rightpanel-toggle" onClick={() => setShowMore((value) => !value)}>
        {showMore ? "Hide copilot details" : "Show copilot details"}
      </button>
      {showMore ? (
        <>
          <div className="card notes-header-card">
            <div className="notes-workspace-label">Auto Summary Sidebar</div>
            <div className="bullet-list">
              <div className="bullet-item">Explain the current page in plain language</div>
              <div className="bullet-item">Generate study questions, insights, or next steps</div>
              <div className="bullet-item">Turn the page into export-ready notes</div>
            </div>
          </div>
          <div className="card notes-header-card">
            <div className="notes-workspace-label">Citation Draft</div>
            <p className="muted">
              {activeWorkspace ? buildCitationDraft(activeWorkspace, activeTab) : "Visit a page to draft a source citation."}
            </p>
          </div>
          <div className="card notes-header-card">
            <div className="notes-workspace-label">Workflow Signals</div>
            <div className="signal-list">
              <div className="signal-pill">{activeWorkspace?.intent || "research"} mode active</div>
              <div className="signal-pill">
                {activeWorkspace?.savedSources.length || 0} saved source
                {activeWorkspace?.savedSources.length === 1 ? "" : "s"}
              </div>
              <div className="signal-pill">
                {activeWorkspace?.tasks.filter((task) => !task.done).length || 0} open tasks
              </div>
            </div>
          </div>
        </>
      ) : null}
      <h2 className="section-title">Notes</h2>
      <div className="card notes-header-card">
        <div className="notes-workspace-label">{activeWorkspace?.name || "Workspace"}</div>
        <p className="muted">Notes are saved per workspace so research stays grouped.</p>
      </div>
      <textarea
        className="notes-area"
        value={activeWorkspace?.notes || ""}
        onChange={(event) =>
          activeWorkspace && updateWorkspaceNotes(activeWorkspace.id, event.target.value)
        }
        placeholder="Write notes here..."
      />
    </div>
  );
}
