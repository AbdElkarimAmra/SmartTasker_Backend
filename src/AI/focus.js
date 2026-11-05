// src/AI/focus.js  (CJS)
const { ChatOpenAI } = require("@langchain/openai");
const { StructuredOutputParser } = require("@langchain/core/output_parsers");
const { ChatPromptTemplate } = require("@langchain/core/prompts");
const { z } = require("zod");

// Zod schema
const FocusSchema = z.object({
  picks: z.array(
    z.object({
      taskId: z.string(),
      reason: z.string(),
    })
  ).max(3),
  microPlan: z.object({
    forTaskId: z.string(),
    steps: z.array(z.string()).min(3).max(5),
  }),
});

const parser = StructuredOutputParser.fromZodSchema(FocusSchema);

// Keep the same env var name
const apiKey = process.env.GROQ_API_KEY;

if (!apiKey) {
  console.warn("[focus.js] GROQ_API_KEY is missing");
}

const model = new ChatOpenAI({
  model:"grok-3-mini",
  temperature: 0.2,
  apiKey,
  configuration: {
    baseURL: "https://api.x.ai/v1",
  },
});

// Prompt
const prompt = ChatPromptTemplate.fromTemplate(
  [
    "You are a pragmatic productivity assistant.",
    "{format_instructions}",
    "Rules:",
    "- Pick at most 3 tasks for TODAY.",
    "- Prioritize: (1) due soon, (2) high priority, (3) quick wins.",
    "- Ignore tasks with status = 'completed'.",
    "- Focus on tasks where {nowIso} < dueDate.",
    "- If none have dueDate, pick quick wins (short titles, smaller scope).",
    "",
    "Current datetime (ISO): {nowIso}",
    "User timezone: {tz}",
    "",
    "Tasks JSON:",
    "{payload}",
  ].join("\n")
);

const chain = prompt.pipe(model).pipe(parser);

if (!apiKey) {
  console.error("CRITICAL: GROQ_API_KEY is undefined!");
} else {
  console.log(`Key loaded: ${apiKey.substring(0, 6)}...`);
}

// connection point with LLM. It sends the tasks to the LLM,
// and enforces output rules defined by Zod earlier
async function getFocusPicks({ nowIso, tz, tasks }) {
  const payload = JSON.stringify({ tasks });

  return chain.invoke({
    nowIso,
    tz,
    payload,
    format_instructions: parser.getFormatInstructions(),
  });
}

// async function createTaskAI(task){
//   await 
// }

module.exports = getFocusPicks;

