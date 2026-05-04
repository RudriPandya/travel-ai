import { Router } from "express";
import { db } from "../db.js";
import { chatMessagesTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import OpenAI from "openai";

const router = Router();

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

const TRAVEL_SYSTEM_PROMPT = `You are VoyageAI, a world-class AI travel concierge. You have deep expertise in:
- International travel logistics, visa requirements, customs, and entry rules
- Flight and hotel recommendations with insider knowledge
- Local culture, cuisine, hidden gems, and seasonal tips
- Budget optimization and deal-finding strategies
- Corporate travel policy compliance
- Safety, health, and travel insurance guidance

Be concise but rich with specific, actionable insights. Avoid generic advice — think like a well-traveled friend who genuinely knows the destination. Use specific names, prices, and timing when relevant.`;

const PLANNER_SYSTEM_PROMPT = `You are VoyageAI's trip planning engine. Generate a detailed, day-by-day travel itinerary in JSON format.

You MUST respond with valid JSON that follows this EXACT structure (no variants array, just a single flat itinerary):
{
  "name": "Trip name",
  "destination": "City, Country",
  "summary": "2-3 sentence trip overview",
  "duration": 10,
  "estimatedBudget": 3500,
  "days": [
    {
      "dayNumber": 1,
      "title": "Day theme",
      "estimatedCost": 150,
      "activities": [
        {
          "timeSlot": "morning",
          "name": "Activity name",
          "description": "2-3 sentences with specific details, why it's great",
          "location": "Specific venue/address",
          "estimatedCost": 0,
          "duration": 120,
          "category": "culture",
          "tips": "1 specific insider tip"
        }
      ]
    }
  ]
}

Keep each day to 3-5 activities. Be specific with venues, prices, and timing. Make the itinerary genuinely exciting. The duration field is the total number of days as a number.`;

router.post("/ai/plan", async (req, res) => {
  const { prompt, variant } = req.body;
  if (!prompt) { res.status(400).json({ error: "prompt is required" }); return; }

  const variantContext = variant === "budget"
    ? "Optimize for budget travel — hostels, street food, free attractions, local transport."
    : variant === "premium"
    ? "Optimize for premium/luxury travel — 5-star hotels, fine dining, private tours, business class."
    : "Balance comfort and cost — mid-range hotels, mix of local and nice restaurants, some splurges.";

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: PLANNER_SYSTEM_PROMPT },
        { role: "user", content: `${prompt}\n\nStyle: ${variantContext}` },
      ],
      response_format: { type: "json_object" },
      temperature: 0.8,
    });

    const content = completion.choices[0].message.content ?? "{}";
    const plan = JSON.parse(content);
    res.json(plan);
  } catch (error) {
    req.log?.error({ err: error }, "AI plan error");
    res.status(500).json({ error: "Failed to generate itinerary. Please try again." });
  }
});

router.post("/ai/chat", async (req, res) => {
  const { message, sessionId } = req.body;
  if (!message) { res.status(400).json({ error: "message is required" }); return; }
  const userId = 1;
  const sid = sessionId ?? `session-${userId}-default`;

  await db.insert(chatMessagesTable).values({
    userId,
    sessionId: sid,
    role: "user",
    content: message,
  });

  const history = await db.select().from(chatMessagesTable)
    .where(eq(chatMessagesTable.sessionId, sid))
    .orderBy(asc(chatMessagesTable.createdAt))
    .limit(20);

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: TRAVEL_SYSTEM_PROMPT },
        ...history.slice(-10).map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
      ],
      temperature: 0.7,
      max_tokens: 600,
    });

    const reply = completion.choices[0].message.content ?? "I'm having trouble responding right now. Please try again.";

    await db.insert(chatMessagesTable).values({
      userId,
      sessionId: sid,
      role: "assistant",
      content: reply,
    });

    res.json({
      message: reply,
      sessionId: sid,
    });
  } catch (error) {
    req.log?.error({ err: error }, "AI chat error");
    res.status(500).json({ error: "AI is temporarily unavailable. Please try again." });
  }
});

router.get("/ai/chat/history", async (req, res) => {
  const userId = 1;
  const sid = (req.query.sessionId as string) ?? `session-${userId}-default`;
  const messages = await db.select().from(chatMessagesTable)
    .where(eq(chatMessagesTable.sessionId, sid))
    .orderBy(asc(chatMessagesTable.createdAt))
    .limit(50);
  res.json(messages);
});

export default router;
