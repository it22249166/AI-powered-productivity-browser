import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Workspace } from "../types/browser";

type WorkspaceState = {
  activeWorkspaceId: string;
  workspaces: Workspace[];
  addWorkspace: () => string;
  removeWorkspace: (id: string) => void;
  setActiveWorkspace: (id: string) => void;
  updateWorkspaceNotes: (id: string, notes: string) => void;
};

const createWorkspace = (name: string, notes = ""): Workspace => ({
  id: crypto.randomUUID(),
  name,
  notes,
});

const defaultWorkspaces = [
  createWorkspace("General", "Capture quick notes while you browse."),
  createWorkspace("Study", "Collect ideas, references, and next steps."),
];

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set, get) => ({
      activeWorkspaceId: defaultWorkspaces[0].id,
      workspaces: defaultWorkspaces,

      addWorkspace: () => {
        const name = `Workspace ${get().workspaces.length + 1}`;
        const workspace = createWorkspace(name, "New workspace");

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

      updateWorkspaceNotes: (id, notes) =>
        set((state) => ({
          workspaces: state.workspaces.map((workspace) =>
            workspace.id === id ? { ...workspace, notes } : workspace
          ),
        })),
    }),
    {
      name: "intentra-workspaces",
    }
  )
);
