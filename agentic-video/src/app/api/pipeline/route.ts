import { NextResponse } from "next/server";
import { z } from "zod";
import { runAutomationPipeline } from "@/lib/pipeline";
import { PipelineStatusMessage } from "@/lib/types";

const payloadSchema = z.object({
  topic: z.string().min(3),
  targetAudience: z.string().min(3),
  contentGoals: z.string().min(3),
  tone: z.string().optional(),
  keywords: z.array(z.string().min(1)).optional(),
  callToAction: z.string().optional(),
  durationSeconds: z.number().int().min(30).max(300).optional(),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = payloadSchema.parse(body);

  const statusUpdates: PipelineStatusMessage[] = [];

  try {
    const result = await runAutomationPipeline(parsed, {
      onStatus: (status) => statusUpdates.push(status),
    });

    return NextResponse.json({ ok: true, result, statusUpdates });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown pipeline failure";

    return NextResponse.json(
      {
        ok: false,
        error: message,
        statusUpdates,
      },
      { status: 500 }
    );
  }
}
