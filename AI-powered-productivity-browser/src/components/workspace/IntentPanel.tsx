import type { IntentMode } from "../../types/browser";
import { useWorkspaceStore } from "../../store/workspaceStore";

const intents: { id: IntentMode; title: string; description: string }[] = [
  { id: "study", title: "Study", description: "Summaries, Q&A, and clean notes" },
  { id: "research", title: "Research", description: "Compare sources and collect evidence" },
  { id: "write", title: "Write", description: "Turn reading into drafts and citations" },
  { id: "compare", title: "Compare", description: "Review multiple sites side by side" },
  { id: "apply", title: "Apply", description: "Track forms, emails, and deadlines" },
  { id: "debug", title: "Debug", description: "Capture errors, docs, and action items" },
];

export default function IntentPanel() {
  const activeWorkspaceId = useWorkspaceStore((state) => state.activeWorkspaceId);
  const activeWorkspace = useWorkspaceStore((state) =>
    state.workspaces.find((workspace) => workspace.id === activeWorkspaceId)
  );
  const updateWorkspaceIntent = useWorkspaceStore((state) => state.updateWorkspaceIntent);
  const selectedIntent = intents.find((intent) => intent.id === activeWorkspace?.intent) || intents[0];

  return (
    <div className="intent-panel card">
      <div className="panel-heading">
        <h3 className="section-title section-title-tight">Mode</h3>
        <span className="status-chip">Simple</span>
      </div>
      <label className="intent-select-wrap">
        <span className="mini-label">Current browsing mode</span>
        <select
          className="intent-select"
          value={activeWorkspace?.intent || "research"}
          onChange={(event) =>
            activeWorkspace &&
            updateWorkspaceIntent(activeWorkspace.id, event.target.value as IntentMode)
          }
        >
          {intents.map((intent) => (
            <option key={intent.id} value={intent.id}>
              {intent.title}
            </option>
          ))}
        </select>
      </label>
      <p className="intent-helper">{selectedIntent.description}</p>
    </div>
  );
}
