declare namespace JSX {
  interface IntrinsicElements {
    webview: any;
  }
}

declare global {
  interface Window {
    electronAPI: Record<string, never>;
  }
}

export {};
