export type Tab = {
  id: string;
  title: string;
  url: string;
  workspaceId: string;
  isActive: boolean;
  isLoading: boolean;
  canGoBack: boolean;
  canGoForward: boolean;
};

export type Workspace = {
  id: string;
  name: string;
  notes: string;
};
