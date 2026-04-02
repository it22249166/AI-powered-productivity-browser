export type IntentMode =
  | "study"
  | "research"
  | "write"
  | "compare"
  | "apply"
  | "debug";

export type Tab = {
  id: string;
  title: string;
  url: string;
  workspaceId: string;
  memory: string;
  isActive: boolean;
  isLoading: boolean;
  canGoBack: boolean;
  canGoForward: boolean;
};

export type SavedSource = {
  id: string;
  title: string;
  url: string;
  note: string;
};

export type WorkspaceTask = {
  id: string;
  text: string;
  done: boolean;
};

export type Workspace = {
  id: string;
  name: string;
  intent: IntentMode;
  goal: string;
  notes: string;
  savedSources: SavedSource[];
  tasks: WorkspaceTask[];
};
