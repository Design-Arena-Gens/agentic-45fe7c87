"use client";

import { FormEvent, useState } from "react";
import styles from "./page.module.css";
import type {
  PipelineResult,
  PipelineStatusMessage,
} from "@/lib/types";

type FormState = {
  topic: string;
  targetAudience: string;
  contentGoals: string;
  tone: string;
  keywords: string;
  callToAction: string;
  durationSeconds: number;
};

const initialForm: FormState = {
  topic: "AI automation for video creators",
  targetAudience: "Busy YouTubers and content marketers",
  contentGoals: "Educate viewers on automating their video workflow",
  tone: "Energetic and insightful",
  keywords: "automation, AI tools, YouTube growth",
  callToAction: "Subscribe for weekly automation playbooks",
  durationSeconds: 120,
};

export default function Home() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [status, setStatus] = useState<PipelineStatusMessage[]>([]);
  const [result, setResult] = useState<PipelineResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setStatus([]);
    setResult(null);
    setError(null);

    try {
      const response = await fetch("/api/pipeline", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic: form.topic,
          targetAudience: form.targetAudience,
          contentGoals: form.contentGoals,
          tone: form.tone,
          callToAction: form.callToAction,
          durationSeconds: form.durationSeconds,
          keywords: form.keywords
            .split(",")
            .map((keyword) => keyword.trim())
            .filter(Boolean),
        }),
      });

      const data = await response.json();

      setStatus(data.statusUpdates ?? []);

      if (!response.ok) {
        throw new Error(data.error ?? "Pipeline failed");
      }

      setResult(data.result);
    } catch (caughtError) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : "Unexpected error";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <header className={styles.header}>
          <div>
            <p className={styles.badge}>Autonomous Video Producer</p>
            <h1>Full-funnel video automation for your YouTube channel</h1>
            <p>
              Generate scripts, craft Veo prompts, render high-impact visuals, and
              publish directly to YouTube—entirely agentic and hands-free.
            </p>
          </div>
        </header>

        <section className={styles.grid}>
          <form className={styles.formCard} onSubmit={handleSubmit}>
            <div className={styles.formHeader}>
              <h2>Production Brief</h2>
              <p>Define your creative direction. The agent handles everything else.</p>
            </div>
            <label>
              <span>Topic</span>
              <input
                type="text"
                value={form.topic}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, topic: event.target.value }))
                }
                placeholder="What should this video cover?"
                required
              />
            </label>
            <label>
              <span>Target audience</span>
              <input
                type="text"
                value={form.targetAudience}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    targetAudience: event.target.value,
                  }))
                }
                placeholder="Who is this video for?"
                required
              />
            </label>
            <label>
              <span>Content goals</span>
              <textarea
                value={form.contentGoals}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    contentGoals: event.target.value,
                  }))
                }
                placeholder="What outcome should this video drive?"
                required
              />
            </label>
            <label>
              <span>Tone</span>
              <input
                type="text"
                value={form.tone}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, tone: event.target.value }))
                }
                placeholder="Energetic, cinematic, inspirational?"
              />
            </label>
            <label>
              <span>Keywords</span>
              <input
                type="text"
                value={form.keywords}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, keywords: event.target.value }))
                }
                placeholder="Comma-separated keywords"
              />
            </label>
            <label>
              <span>Call to action</span>
              <input
                type="text"
                value={form.callToAction}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    callToAction: event.target.value,
                  }))
                }
                placeholder="What should viewers do next?"
              />
            </label>
            <label>
              <span>Target duration (seconds)</span>
              <input
                type="number"
                min={30}
                max={300}
                value={form.durationSeconds}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    durationSeconds: Number(event.target.value),
                  }))
                }
              />
            </label>
            <button type="submit" disabled={loading}>
              {loading ? "Running automation…" : "Launch production"}
            </button>
            {error && <p className={styles.error}>{error}</p>}
          </form>

          <aside className={styles.statusCard}>
            <div className={styles.formHeader}>
              <h2>Agent timeline</h2>
              <p>Track each autonomous action from ideation to publishing.</p>
            </div>
            <ul>
              {status.length === 0 && (
                <li className={styles.placeholder}>Status updates will appear here.</li>
              )}
              {status.map((entry, index) => (
                <li key={`${entry.stage}-${index}`}>
                  <span className={styles.statusStage}>{entry.stage}</span>
                  <p>{entry.detail}</p>
                </li>
              ))}
            </ul>
          </aside>
        </section>

        {result && (
          <section className={styles.resultsSection}>
            <div className={styles.resultCard}>
              <h2>Production script</h2>
              <div className={styles.scriptBlock}>
                <h3>Hook</h3>
                <p>{result.script.hook}</p>
                <div className={styles.sectionsGrid}>
                  {result.script.sections.map((section) => (
                    <article key={section.heading}>
                      <header>
                        <h4>{section.heading}</h4>
                        <span>{section.durationSeconds}s</span>
                      </header>
                      <p>{section.narrative}</p>
                    </article>
                  ))}
                </div>
                <h3>Outro</h3>
                <p>{result.script.outro}</p>
              </div>
            </div>

            <div className={styles.resultCard}>
              <h2>Veo storyboard prompts</h2>
              <div className={styles.promptList}>
                {result.visualPrompts.map((prompt) => (
                  <article key={prompt.scene}>
                    <header>
                      <h4>{prompt.scene}</h4>
                      <span>{prompt.durationSeconds}s</span>
                    </header>
                    <p>{prompt.prompt}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className={styles.resultCard}>
              <h2>Publishing summary</h2>
              <dl>
                <div>
                  <dt>YouTube link</dt>
                  <dd>
                    <a href={result.youtubeVideoUrl} target="_blank" rel="noreferrer">
                      {result.youtubeVideoUrl}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt>Download</dt>
                  <dd>
                    <a href={result.videoDownloadUrl} target="_blank" rel="noreferrer">
                      Final render
                    </a>
                  </dd>
                </div>
                <div>
                  <dt>Tags</dt>
                  <dd>{result.metadata.tags.join(", ")}</dd>
                </div>
              </dl>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
