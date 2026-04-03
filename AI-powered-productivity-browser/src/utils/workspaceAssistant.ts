import type { AssistantResult, IntentMode, Tab, Workspace } from "../types/browser";

type ActionOutcome = {
  result: AssistantResult;
  suggestedNotes?: string;
  suggestedTasks?: string[];
  suggestedSourceNote?: string;
};

const hostFromUrl = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
};

const pageLabel = (tab: Tab | undefined) =>
  tab?.title?.trim() || (tab ? hostFromUrl(tab.url) : "this page");

const pagePurpose = (tab: Tab | undefined) =>
  tab?.memory?.trim() || "No explicit tab purpose has been saved yet.";

const intentVerb: Record<IntentMode, string> = {
  study: "learn the page faster",
  research: "collect the strongest evidence",
  write: "turn the page into writing material",
  compare: "compare this source against others",
  apply: "track next steps and deadlines",
  debug: "extract debugging context",
};

const buildNotesBlock = (workspace: Workspace, tab: Tab | undefined, title: string, bullets: string[]) =>
  [
    `## ${title}`,
    `Workspace: ${workspace.name}`,
    `Page: ${pageLabel(tab)}`,
    `Source: ${tab?.url || "N/A"}`,
    "",
    ...bullets.map((bullet) => `- ${bullet}`),
  ].join("\n");

export const runAssistantAction = (
  actionLabel: string,
  workspace: Workspace,
  tab: Tab | undefined
): ActionOutcome => {
  const page = pageLabel(tab);
  const host = tab ? hostFromUrl(tab.url) : "this page";
  const purpose = pagePurpose(tab);
  const action = actionLabel.toLowerCase();
  const createdAt = Date.now();

  if (action.includes("explain")) {
    const bullets = [
      `${page} is likely relevant because the current intent is to ${intentVerb[workspace.intent]}.`,
      `The source host is ${host}.`,
      `Your saved page purpose: ${purpose}`,
    ];

    return {
      result: {
        title: "Plain-language explanation",
        actionLabel,
        createdAt,
        content: bullets.join("\n"),
      },
      suggestedNotes: buildNotesBlock(workspace, tab, "Plain-language explanation", bullets),
    };
  }

  if (action.includes("summarize")) {
    const bullets = [
      `Source summary for ${page}.`,
      `The page should be reviewed for the main claims, supporting evidence, and anything tied to ${workspace.goal.toLowerCase()}.`,
      `Keep this source if it strengthens your current ${workspace.intent} workflow.`,
    ];

    return {
      result: {
        title: "Page summary",
        actionLabel,
        createdAt,
        content: bullets.join("\n"),
      },
      suggestedNotes: buildNotesBlock(workspace, tab, "Page summary", bullets),
      suggestedSourceNote: `Saved from ${host}. Relevant because: ${purpose}`,
    };
  }

  if (action.includes("task")) {
    const tasks = [
      `Review ${page} for the most useful details`,
      `Capture the strongest evidence from ${host}`,
      `Decide whether ${page} supports the workspace goal`,
    ];

    return {
      result: {
        title: "Suggested action items",
        actionLabel,
        createdAt,
        content: tasks.map((task, index) => `${index + 1}. ${task}`).join("\n"),
      },
      suggestedTasks: tasks,
    };
  }

  if (action.includes("flashcard")) {
    const bullets = [
      `Q: Why is ${page} useful?`,
      `A: It supports the ${workspace.intent} workflow and should be reduced to reusable notes.`,
      `Q: What should be captured next?`,
      `A: Key terms, facts, and one clear action from ${host}.`,
    ];

    return {
      result: {
        title: "Flashcard draft",
        actionLabel,
        createdAt,
        content: bullets.join("\n"),
      },
      suggestedNotes: buildNotesBlock(workspace, tab, "Flashcard draft", bullets),
    };
  }

  if (action.includes("source note") || action.includes("source")) {
    const note = `Source note for ${page}: keep this page if it helps ${workspace.goal.toLowerCase()}. Purpose remembered: ${purpose}`;

    return {
      result: {
        title: "Source note",
        actionLabel,
        createdAt,
        content: note,
      },
      suggestedSourceNote: note,
    };
  }

  if (action.includes("bug")) {
    const bullets = [
      `Observed page: ${page}`,
      `Context host: ${host}`,
      `Why it matters: ${purpose}`,
      `Next step: reproduce, capture console/network context, then draft the fix.`,
    ];

    return {
      result: {
        title: "Bug report draft",
        actionLabel,
        createdAt,
        content: bullets.join("\n"),
      },
      suggestedNotes: buildNotesBlock(workspace, tab, "Bug report draft", bullets),
      suggestedTasks: [`Reproduce issue from ${page}`, `Capture logs for ${host}`],
    };
  }

  const fallback = `Prepared ${actionLabel} for ${page}. Use the result to continue your ${workspace.intent} workflow.`;
  return {
    result: {
      title: actionLabel,
      actionLabel,
      createdAt,
      content: fallback,
    },
  };
};

export const buildCitationDraft = (workspace: Workspace, tab: Tab | undefined) => {
  if (!tab) {
    return "Open a page to generate a citation draft.";
  }

  return `${tab.title || hostFromUrl(tab.url)}. ${hostFromUrl(tab.url)}. Accessed in ${workspace.name}. URL: ${tab.url}`;
};

export const exportWorkspaceMarkdown = (workspace: Workspace) => {
  const lines = [
    `# ${workspace.name}`,
    "",
    `Intent: ${workspace.intent}`,
    `Goal: ${workspace.goal}`,
    "",
    "## Notes",
    workspace.notes || "No notes yet.",
    "",
    "## Saved Sources",
    ...(workspace.savedSources.length > 0
      ? workspace.savedSources.map((source) => `- ${source.title} (${source.url})\n  - ${source.note}`)
      : ["No saved sources yet."]),
    "",
    "## Tasks",
    ...(workspace.tasks.length > 0
      ? workspace.tasks.map((task) => `- [${task.done ? "x" : " "}] ${task.text}`)
      : ["No tasks yet."]),
    "",
    "## Last Assistant Result",
    workspace.assistantResult
      ? `${workspace.assistantResult.title}\n\n${workspace.assistantResult.content}`
      : "No assistant result yet.",
  ];

  return lines.join("\n");
};
