import { useMemo, useState } from "react";
import { useBrowserStore } from "../../store/browserStore";
import { useWorkspaceStore } from "../../store/workspaceStore";
import type { IntentMode } from "../../types/browser";

const intentCopy: Record<
  IntentMode,
  { headline: string; helper: string; prompts: string[]; taskHints: string[] }
> = {
  study: {
    headline: "Turn pages into class-ready notes",
    helper: "Summarize lessons, generate quiz questions, and keep only the key concepts.",
    prompts: ["Explain this simply", "Create flashcards", "Find exam topics"],
    taskHints: ["Review key definitions", "Summarize this lecture page", "Save a citation"],
  },
  research: {
    headline: "Collect evidence, not just tabs",
    helper: "Save sources, compare viewpoints, and keep an audit trail for your conclusions.",
    prompts: ["Compare viewpoints", "Extract statistics", "Generate source notes"],
    taskHints: ["Save this source", "Compare with another page", "Extract action items"],
  },
  write: {
    headline: "Read once, draft faster",
    helper: "Convert articles and docs into outlines, quotes, and citations for writing.",
    prompts: ["Build an outline", "Find quotable lines", "Draft a paragraph"],
    taskHints: ["Capture supporting evidence", "Generate a citation", "Save a quote idea"],
  },
  compare: {
    headline: "Compare 2 to 4 pages with intent",
    helper: "Use the workspace board to pin sources and spot differences before deciding.",
    prompts: ["Highlight differences", "Show overlap", "Recommend the best option"],
    taskHints: ["Add a comparison source", "Summarize the trade-offs", "Mark a winner"],
  },
  apply: {
    headline: "Track applications and deadlines",
    helper: "Use tab memory for each form or listing so you never lose why it mattered.",
    prompts: ["Extract deadlines", "List required documents", "Summarize the role"],
    taskHints: ["Save recruiter contact", "Note the deadline", "Extract the checklist"],
  },
  debug: {
    headline: "Browse like an engineer on a bug hunt",
    helper: "Keep docs, localhost tabs, issue pages, and repro notes in one flow.",
    prompts: ["Explain this error", "Summarize the docs", "Draft a bug report"],
    taskHints: ["Capture repro steps", "Save the relevant docs", "List likely fixes"],
  },
};

const formatHost = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
};

export default function WorkspaceDashboard() {
  const [taskInput, setTaskInput] = useState("");
  const [selectedPrompt, setSelectedPrompt] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const activeWorkspaceId = useWorkspaceStore((state) => state.activeWorkspaceId);
  const activeWorkspace = useWorkspaceStore((state) =>
    state.workspaces.find((workspace) => workspace.id === activeWorkspaceId)
  );
  const updateWorkspaceGoal = useWorkspaceStore((state) => state.updateWorkspaceGoal);
  const addSavedSource = useWorkspaceStore((state) => state.addSavedSource);
  const removeSavedSource = useWorkspaceStore((state) => state.removeSavedSource);
  const addTask = useWorkspaceStore((state) => state.addTask);
  const toggleTask = useWorkspaceStore((state) => state.toggleTask);
  const activeTab = useBrowserStore((state) =>
    state.tabs.find((tab) => tab.workspaceId === activeWorkspaceId && tab.isActive)
  );
  const updateTabMemory = useBrowserStore((state) => state.updateTabMemory);

  const currentIntent = activeWorkspace ? intentCopy[activeWorkspace.intent] : null;
  const completionScore = Math.min(
    100,
    activeWorkspace
      ? activeWorkspace.savedSources.length * 20 +
          activeWorkspace.tasks.filter((task) => task.done).length * 15 +
          (activeWorkspace.goal.trim() ? 20 : 0) +
          (activeTab?.memory.trim() ? 15 : 0)
      : 0
  );
  const compareReadiness = Math.min(
    100,
    activeWorkspace ? Math.round((activeWorkspace.savedSources.length / 4) * 100) : 0
  );

  const smartSignals = useMemo(() => {
    if (!activeTab || !activeWorkspace) {
      return [];
    }

    const host = formatHost(activeTab.url);
    return [
      `Ask the page about ${activeTab.title || host}`,
      `Save ${host} into the research board`,
      activeWorkspace.intent === "compare"
        ? "Collect 2 to 4 pages to unlock compare mode"
        : "Keep the purpose of this tab in memory",
    ];
  }, [activeTab, activeWorkspace]);

  const liveInsight = useMemo(() => {
    if (!activeWorkspace || !currentIntent) {
      return "";
    }

    if (!activeTab) {
      return "Open a page and the workspace will start generating summaries, compare signals, and task suggestions.";
    }

    if (selectedPrompt) {
      return `${selectedPrompt} is queued for ${activeTab.title || "this page"}. The copilot can turn the result into notes, tasks, or a saved source.`;
    }

    if (activeWorkspace.intent === "compare" && activeWorkspace.savedSources.length < 2) {
      return "Compare mode becomes more useful after saving at least two strong sources to the board.";
    }

    return `${activeTab.title || "This page"} is active. You can save it to the board, write why it matters, or trigger an AI prompt from the prompt bar.`;
  }, [activeTab, activeWorkspace, currentIntent, selectedPrompt]);

  if (!activeWorkspace || !currentIntent) {
    return null;
  }

  return (
    <div className="workspace-dashboard">
      <div className="hero-card card">
        <div className="hero-copy">
          <span className="eyebrow">AI Workflow Browser</span>
          <h1 className="hero-title">{currentIntent.headline}</h1>
          <p className="hero-text">{currentIntent.helper}</p>
          <div className="hero-summary-row">
            <div className="signal-pill compact-pill">
              {activeWorkspace.savedSources.length} sources
            </div>
            <div className="signal-pill compact-pill">
              {activeWorkspace.tasks.filter((task) => !task.done).length} open tasks
            </div>
            <div className="signal-pill compact-pill">
              {compareReadiness}% compare ready
            </div>
          </div>
          <div className="hero-progress">
            <div className="progress-label-row">
              <span>Workspace momentum</span>
              <strong>{completionScore}%</strong>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${completionScore}%` }} />
            </div>
          </div>
        </div>
        <div className="hero-actions">
          <button
            type="button"
            className="workspace-create hero-action-btn"
            onClick={() =>
              activeTab &&
              addSavedSource(activeWorkspace.id, {
                title: activeTab.title || "Untitled source",
                url: activeTab.url,
                note: activeTab.memory || "Saved from the active tab.",
              })
            }
          >
            Save this page
          </button>
          <button
            type="button"
            className="ghost-action-btn"
            onClick={() => setShowAdvanced((value) => !value)}
          >
            {showAdvanced ? "Hide details" : "Show details"}
          </button>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card dashboard-card dashboard-card-wide">
          <div className="panel-heading">
            <h3 className="section-title section-title-tight">Focus</h3>
            <span className="status-chip">Simple mode</span>
          </div>
          <div className="focus-grid">
            <div>
              <div className="mini-label">Project goal</div>
              <textarea
                className="goal-input"
                value={activeWorkspace.goal}
                onChange={(event) => updateWorkspaceGoal(activeWorkspace.id, event.target.value)}
                placeholder="What outcome are you trying to reach?"
              />
            </div>
            <div>
              <div className="mini-label">Why this tab matters</div>
              <textarea
                className="goal-input"
                value={activeTab?.memory || ""}
                onChange={(event) =>
                  activeTab && updateTabMemory(activeTab.id, event.target.value)
                }
                placeholder="Why did you open this tab?"
              />
            </div>
          </div>
          <div className="signal-list">
            {smartSignals.map((signal) => (
              <div key={signal} className="signal-pill">
                {signal}
              </div>
            ))}
          </div>
        </div>

        <div className="card dashboard-card dashboard-card-wide">
          <div className="panel-heading">
            <h3 className="section-title section-title-tight">Quick Actions</h3>
            <span className="status-chip">Page assistant</span>
          </div>
          <div className="prompt-grid">
            {currentIntent.prompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                className={`prompt-chip ${selectedPrompt === prompt ? "active" : ""}`}
                onClick={() => setSelectedPrompt(prompt)}
              >
                {prompt}
              </button>
            ))}
          </div>
          <div className="assistant-preview">
            <div className="assistant-preview-label">Live AI action</div>
            <p>{liveInsight}</p>
          </div>
        </div>
      </div>

      <div className="card source-board">
        <div className="panel-heading">
          <div>
            <h3 className="section-title section-title-tight">Research Board</h3>
            <p className="muted">Save important pages here. Open details only when you need them.</p>
          </div>
        </div>
        {activeWorkspace.savedSources.length === 0 ? (
          <div className="board-empty-state">
            <div className="board-empty-title">No saved sources yet</div>
            <p className="muted">Use “Save this page” when you find something worth keeping.</p>
          </div>
        ) : (
          <div className="source-grid">
            {activeWorkspace.savedSources.map((source) => (
              <div key={source.id} className="source-card">
                <div className="source-card-top">
                  <strong>{source.title}</strong>
                  <button
                    type="button"
                    className="tab-close"
                    onClick={() => removeSavedSource(activeWorkspace.id, source.id)}
                  >
                    ✕
                  </button>
                </div>
                <span className="source-host">{formatHost(source.url)}</span>
                <p>{source.note}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAdvanced ? (
        <div className="dashboard-grid advanced-grid">
          <div className="card dashboard-card">
            <div className="panel-heading">
              <h3 className="section-title section-title-tight">Task Extraction</h3>
              <span className="status-chip">Action items</span>
            </div>
            <form
              className="task-form"
              onSubmit={(event) => {
                event.preventDefault();
                addTask(activeWorkspace.id, taskInput);
                setTaskInput("");
              }}
            >
              <input
                className="task-input"
                value={taskInput}
                onChange={(event) => setTaskInput(event.target.value)}
                placeholder={currentIntent.taskHints[0]}
              />
              <button type="submit" className="workspace-create task-submit">
                Add
              </button>
            </form>
            <div className="task-list">
              {activeWorkspace.tasks.slice(0, 4).map((task) => (
                <label key={task.id} className={`task-row ${task.done ? "done" : ""}`}>
                  <input
                    type="checkbox"
                    checked={task.done}
                    onChange={() => toggleTask(activeWorkspace.id, task.id)}
                  />
                  <span>{task.text}</span>
                </label>
              ))}
              {activeWorkspace.tasks.length === 0 ? (
                <div className="card-muted">No extracted actions yet. Start with one quick task.</div>
              ) : null}
            </div>
          </div>

          <div className="card dashboard-card">
            <div className="panel-heading">
              <h3 className="section-title section-title-tight">Compare Readiness</h3>
              <span className="status-chip">Advanced</span>
            </div>
            <div className="compare-rail compare-rail-stacked">
              <div className="compare-pill">
                <span>Compare mode</span>
                <strong>
                  {activeWorkspace.savedSources.length < 2 ? "Collect more sources" : "Ready"}
                </strong>
              </div>
              <div className="progress-track compare-track">
                <div className="progress-fill" style={{ width: `${compareReadiness}%` }} />
              </div>
            </div>
            <div className="card-muted">
              Save 2 to 4 strong sources when you want to compare viewpoints side by side.
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
