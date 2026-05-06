import type { ResourceDoc } from "../types";

export type SupportLibrarySection = {
  heading: string;
  paragraphs: string[];
};

export type SupportLibraryArticle = {
  slug: string;
  title: string;
  description: string;
  sections: SupportLibrarySection[];
};

export const SUPPORT_LIBRARY_INDEX: ResourceDoc[] = [
  {
    id: "r1",
    title: "Circle safety & privacy basics",
    description: "How we handle reports, DMs policy, and what stays in the room.",
    type: "guide",
    slug: "circle-safety-privacy-basics",
  },
  {
    id: "r2",
    title: "Consent-forward sharing worksheet",
    description: "Prompts for posting vulnerably while protecting your story.",
    type: "guide",
    slug: "consent-forward-sharing-worksheet",
  },
  {
    id: "r3",
    title: "Negotiation phrases that feel grounded",
    description: "Short scripts for career conversations — community resource.",
    type: "guide",
    slug: "negotiation-phrases-grounded",
  },
  {
    id: "r4",
    title: "Partner toolkit: crisis language",
    description: "National resources for finding help and supporting others.",
    type: "link",
    url: "https://www.samhsa.gov/find-help",
  },
];

const ARTICLES: SupportLibraryArticle[] = [
  {
    slug: "circle-safety-privacy-basics",
    title: "Circle safety & privacy basics",
    description: "How we handle reports, DMs policy, and what stays in the room.",
    sections: [
      {
        heading: "Why this matters",
        paragraphs: [
          "Inner Circle works when members can be honest without fearing screenshots, gossip, or pressure. These basics describe how the space is designed and what you can expect from moderation — not legal advice, but community norms.",
          "If you are in immediate danger, contact local emergency services. This page is about digital community safety, not crisis intervention.",
        ],
      },
      {
        heading: "What stays in the room",
        paragraphs: [
          "Treat neighborhood threads and group spaces as confidential by default. Do not repost someone’s story, photo, or identifying details elsewhere without their clear consent.",
          "Screenshots and copy-paste can break trust even when the intent is good. If you want to share a takeaway, summarize in your own words and keep other people anonymous.",
        ],
      },
      {
        heading: "Direct messages (DMs)",
        paragraphs: [
          "DMs are optional. You can ignore requests that feel intrusive. You never owe anyone a private conversation because they saw you in the feed.",
          "If a DM crosses a boundary — unsolicited promotion, pressure for money or photos, romantic pursuit after you said no — you can block, mute, and report through the tools the app provides.",
        ],
      },
      {
        heading: "Reports and moderation",
        paragraphs: [
          "Reporting is for harm, harassment, scams, and rule-breaking — not for silencing disagreement. When you file a report, include what happened, where, and (if safe) who. Moderators may remove content, warn an account, or suspend access in line with community guidelines.",
          "Moderation is human and imperfect. Appeals or clarifications can be sent through the official support channel on the Support page.",
        ],
      },
      {
        heading: "Protecting your own privacy",
        paragraphs: [
          "Share only what you are comfortable having known inside the Circle. Consider omitting employer names, children’s schools, and exact addresses unless there is a clear, consensual reason.",
          "Review your profile and directory visibility settings regularly. What felt right when you joined may change as your life changes.",
        ],
      },
    ],
  },
  {
    slug: "consent-forward-sharing-worksheet",
    title: "Consent-forward sharing worksheet",
    description: "Prompts for posting vulnerably while protecting your story.",
    sections: [
      {
        heading: "How to use this page",
        paragraphs: [
          "Before you post something raw, pause with these prompts. They are not rules — they are guardrails so your voice stays yours. You can jot answers privately or use them as an outline for a post.",
        ],
      },
      {
        heading: "Intent",
        paragraphs: [
          "What do I want from sharing this right now — connection, advice, witness, venting, or something else?",
          "If I get no replies or only one short reply, will I still be glad I shared?",
        ],
      },
      {
        heading: "Scope",
        paragraphs: [
          "What parts of the story are mine to tell? Who else is involved, and do I need to obscure their details?",
          "What is the smallest honest version that still feels true? (You can always share more later.)",
        ],
      },
      {
        heading: "Safety",
        paragraphs: [
          "Could this post increase risk at home, at work, or legally? If yes, what can I generalize or omit?",
          "Do I need a content note or spoiler line for readers who may be sensitive to this topic?",
        ],
      },
      {
        heading: "Aftercare",
        paragraphs: [
          "What will I do in the next hour after I post — hydrate, walk, text a friend offline, close the app?",
          "Who outside the Circle knows I’m posting this, so I’m not holding the response alone?",
        ],
      },
    ],
  },
  {
    slug: "negotiation-phrases-grounded",
    title: "Negotiation phrases that feel grounded",
    description: "Short scripts for career conversations — community resource.",
    sections: [
      {
        heading: "Using these scripts",
        paragraphs: [
          "These lines are templates — swap in your real numbers, deadlines, and titles. The goal is neutral, clear language that centers your value without performing aggression.",
          "Practice aloud once; your tone matters as much as the words.",
        ],
      },
      {
        heading: "Salary and total compensation",
        paragraphs: [
          "“Based on my experience and the scope of this role, I’m looking for [range]. I’m open to discussing the full package — base, bonus, equity, and flexibility.”",
          "“I appreciate the offer. I’ll need until [date] to review. Is there room to align on [specific piece] given [market data / responsibility]?”",
        ],
      },
      {
        heading: "Role clarity",
        paragraphs: [
          "“To do this well, I’ll need clarity on [metric / stakeholder / decision rights]. Can we document that before I commit?”",
          "“Help me understand how success is measured in the first 90 days.”",
        ],
      },
      {
        heading: "Boundaries and scope creep",
        paragraphs: [
          "“I can deliver A and B this cycle. If we add C, which of these should deprioritize?”",
          "“I’m at capacity this week. I can revisit on [date] or hand off to [person / process].”",
        ],
      },
      {
        heading: "After the conversation",
        paragraphs: [
          "Follow up in writing: thanks, summary of what you agreed, and any open questions. It protects you and reduces misunderstandings.",
          "If you face retaliation for good-faith negotiation, document dates and facts; trusted HR, a union rep, or legal counsel may be appropriate — this guide is not legal advice.",
        ],
      },
    ],
  },
];

const bySlug = new Map(ARTICLES.map((a) => [a.slug, a]));

export function getSupportLibraryArticle(slug: string): SupportLibraryArticle | undefined {
  return bySlug.get(slug);
}
