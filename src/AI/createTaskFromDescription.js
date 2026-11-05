const { ChatOpenAI } = require("@langchain/openai");
const { StructuredOutputParser } = require("@langchain/core/output_parsers");
const { ChatPromptTemplate } = require("@langchain/core/prompts");
const { z } = require("zod");

const TaskSchema = z.object({
  title: z.string(),
  description: z.string(),
  status: z.enum(["todo", "inProgress", "completed"]),
  priority: z.enum(["low", "normal", "high"]),
  dueDate: z.string().nullable().optional(),
});

const parser = StructuredOutputParser.fromZodSchema(TaskSchema);

async function createTaskFromDescription(description) {
  if (typeof description !== "string") {
    throw new Error(`Expected description to be a string, got ${typeof description}`);
  }

  const cleanDescription = description.trim();

  if (!cleanDescription) {
    throw new Error("Description cannot be empty");
  }

  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error("GROQ_API_KEY is missing");
  }

  const model = new ChatOpenAI({
    apiKey,
    model: "grok-3-mini",
    temperature: 0,
    configuration: {
      baseURL: "https://api.x.ai/v1",
    },
  });

  const prompt = ChatPromptTemplate.fromTemplate(`
You are an AI that converts a user's natural language task description into a structured task object.

Rules:
- Create a short clear title.
- Preserve the user's meaning.
- status must be one of: todo, inProgress, completed
- priority must be one of: low, normal, high
- If no clear due date is mentioned, return dueDate as null.
- description should preserve the user's request.

User input:
{description}

{format_instructions}
`);

  const chain = prompt.pipe(model).pipe(parser);

  return await chain.invoke({
    description: cleanDescription,
    format_instructions: parser.getFormatInstructions(),
  });
}

module.exports = createTaskFromDescription;

