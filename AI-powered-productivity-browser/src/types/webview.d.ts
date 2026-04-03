declare namespace JSX {
  interface IntrinsicElements {
    webview: any;
  }
}

declare global {
  interface Window {
    electronAPI: {
      getProxyStatus: () => Promise<{
        connected: boolean;
        label: string;
        country: string;
        proxyRules: string;
        language: string;
        timezone: string;
      }>;
      applyProxy: (payload: {
        proxyRules: string;
        bypassRules: string;
        username: string;
        password: string;
        label: string;
        country: string;
        language: string;
        timezone: string;
      }) => Promise<{
        connected: boolean;
        label: string;
        country: string;
        proxyRules: string;
        language: string;
        timezone: string;
      }>;
      clearProxy: () => Promise<{
        connected: boolean;
        label: string;
        country: string;
        proxyRules: string;
        language: string;
        timezone: string;
      }>;
    };
  }
}

export {};
