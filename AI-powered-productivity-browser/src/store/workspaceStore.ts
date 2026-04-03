import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  AssistantResult,
  HistoryEntry,
  IntentMode,
  SavedSource,
  Workspace,
} from "../types/browser";

type WorkspaceState = {
  activeWorkspaceId: string;
  workspaces: Workspace[];
  addWorkspace: () => string;
  removeWorkspace: (id: string) => void;
  setActiveWorkspace: (id: string) => void;
  updateWorkspaceIntent: (id: string, intent: IntentMode) => void;
  updateWorkspaceGoal: (id: string, goal: string) => void;
  updateWorkspaceNotes: (id: string, notes: string) => void;
  appendWorkspaceNotes: (id: string, notes: string) => void;
  addSavedSource: (workspaceId: string, source: Omit<SavedSource, "id">) => void;
  removeSavedSource: (workspaceId: string, sourceId: string) => void;
  addHistoryEntry: (workspaceId: string, entry: Omit<HistoryEntry, "id" | "visitedAt">) => void;
  addTask: (workspaceId: string, text: string) => void;
  addTasks: (workspaceId: string, tasks: string[]) => void;
  toggleTask: (workspaceId: string, taskId: string) => void;
  setAssistantResult: (workspaceId: string, result: AssistantResult | null) => void;
};

const createWorkspace = (
  name: string,
  intent: IntentMode,
  goal: string,
  notes = ""
): Workspace => ({
  id: crypto.randomUUID(),
  name,
  intent,
  goal,
  notes,
  savedSources: [],
  history: [],
  tasks: [],
  assistantResult: null,
});

const defaultWorkspaces = [
  createWorkspace(
    "Exam Prep",
    "study",
    "Understand the material faster and turn pages into notes.",
    "Capture quick notes while you browse."
  ),
  createWorkspace(
    "Client Research",
    "research",
    "Collect sources, compare viewpoints, and export a clean brief.",
    "Collect ideas, references, and next steps."
  ),
];

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set, get) => ({
      activeWorkspaceId: defaultWorkspaces[0].id,
      workspaces: defaultWorkspaces,

      addWorkspace: () => {
        const name = `Workspace ${get().workspaces.length + 1}`;
        const workspace = createWorkspace(
          name,
          "research",
          "Define the outcome for this project.",
          "New workspace"
        );

        set((state) => ({
          activeWorkspaceId: workspace.id,
          workspaces: [...state.workspaces, workspace],
        }));

        return workspace.id;
      },

      removeWorkspace: (id) =>
        set((state) => {
          if (state.workspaces.length === 1) {
            return state;
          }

          const workspaces = state.workspaces.filter((workspace) => workspace.id !== id);
          const activeWorkspaceId =
            state.activeWorkspaceId === id ? workspaces[0].id : state.activeWorkspaceId;

          return {
            activeWorkspaceId,
            workspaces,
          };
        }),

      setActiveWorkspace: (id) =>
        set((state) => {
          if (!state.workspaces.some((workspace) => workspace.id === id)) {
            return state;
          }

          return { activeWorkspaceId: id };
        }),

      updateWorkspaceIntent: (id, intent) =>
        set((state) => ({
          workspaces: state.workspaces.map((workspace) =>
            workspace.id === id ? { ...workspace, intent } : workspace
          ),
        })),

      updateWorkspaceGoal: (id, goal) =>
        set((state) => ({
          workspaces: state.workspaces.map((workspace) =>
            workspace.id === id ? { ...workspace, goal } : workspace
          ),
        })),

      updateWorkspaceNotes: (id, notes) =>
        set((state) => ({
          workspaces: state.workspaces.map((workspace) =>
            workspace.id === id ? { ...workspace, notes } : workspace
          ),
        })),

      appendWorkspaceNotes: (id, notes) => {
        const trimmed = notes.trim();
        if (!trimmed) {
          return;
        }

        set((state) => ({
          workspaces: state.workspaces.map((workspace) =>
            workspace.id === id
              ? {
                  ...workspace,
                  notes: workspace.notes.trim()
                    ? `${workspace.notes.trim()}\n\n${trimmed}`
                    : trimmed,
                }
              : workspace
          ),
        }));
      },

      addSavedSource: (workspaceId, source) =>
        set((state) => ({
          workspaces: state.workspaces.map((workspace) =>
            workspace.id === workspaceId
              ? {
                  ...workspace,
                  savedSources: [
                    {
                      id: crypto.randomUUID(),
                      ...source,
                    },
                    ...workspace.savedSources.filter((item) => item.url !== source.url),
                  ].slice(0, 4),
                }
              : workspace
          ),
        })),

      removeSavedSource: (workspaceId, sourceId) =>
        set((state) => ({
          workspaces: state.workspaces.map((workspace) =>
            workspace.id === workspaceId
              ? {
                  ...workspace,
                  savedSources: workspace.savedSources.filter((source) => source.id !== sourceId),
                }
              : workspace
          ),
        })),

      addHistoryEntry: (workspaceId, entry) =>
        set((state) => ({
          workspaces: state.workspaces.map((workspace) =>
            workspace.id === workspaceId
              ? {
                  ...workspace,
                  history: [
                    {
                      id: crypto.randomUUID(),
                      visitedAt: Date.now(),
                      ...entry,
                    },
                    ...workspace.history.filter((item) => item.url !== entry.url),
                  ].slice(0, 12),
                }
              : workspace
          ),
        })),

      addTask: (workspaceId, text) => {
        const trimmed = text.trim();
        if (!trimmed) {
          return;
        }

        set((state) => ({
          workspaces: state.workspaces.map((workspace) =>
            workspace.id === workspaceId
              ? {
                  ...workspace,
                  tasks: [
                    {
                      id: crypto.randomUUID(),
                      text: trimmed,
                      done: false,
                    },
                    ...workspace.tasks,
                  ],
                }
              : workspace
          ),
        }));
      },

      addTasks: (workspaceId, tasks) => {
        const normalized = tasks.map((task) => task.trim()).filter(Boolean);
        if (normalized.length === 0) {
          return;
        }

        set((state) => ({
          workspaces: state.workspaces.map((workspace) =>
            workspace.id === workspaceId
              ? {
                  ...workspace,
                  tasks: [
                    ...normalized.map((task) => ({
                      id: crypto.randomUUID(),
                      text: task,
                      done: false,
                    })),
                    ...workspace.tasks,
                  ],
                }
              : workspace
          ),
        }));
      },

      toggleTask: (workspaceId, taskId) =>
        set((state) => ({
          workspaces: state.workspaces.map((workspace) =>
            workspace.id === workspaceId
              ? {
                  ...workspace,
                  tasks: workspace.tasks.map((task) =>
                    task.id === taskId ? { ...task, done: !task.done } : task
                  ),
                }
              : workspace
          ),
        })),

      setAssistantResult: (workspaceId, result) =>
        set((state) => ({
          workspaces: state.workspaces.map((workspace) =>
            workspace.id === workspaceId ? { ...workspace, assistantResult: result } : workspace
          ),
        })),
    }),
    {
      name: "intentra-workspaces",
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<WorkspaceState> | undefined;

        return {
          ...currentState,
          ...persisted,
          workspaces: (persisted?.workspaces || currentState.workspaces).map((workspace) => ({
            intent: "research",
            goal: "Define the outcome for this project.",
            notes: "",
            savedSources: [],
            history: [],
            tasks: [],
            assistantResult: null,
            ...workspace,
          })),
        };
      },
    }
  )
);
