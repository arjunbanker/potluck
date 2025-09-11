import { RecipeData } from "./schema";

const PARSE_RECIPE_PROMPT = `You are a recipe parser. Extract structured recipe data from the provided text.

Rules:
1. Extract all recipe components accurately
2. For ingredients, preserve exact measurements and preparations
3. For instructions, be clear and concise but preserve all important details like temperatures and times
4. Infer missing information when reasonable (e.g., total time from prep + cook time)
5. Return valid JSON matching the provided schema

Output the recipe data as a JSON object with this structure:
{
  "summary": "Brief 1-2 sentence description",
  "description": "Longer description if available",
  "servings": { "amount": number, "unit": "servings/pieces/etc" },
  "times": { "prep": minutes, "cook": minutes, "total": minutes },
  "difficulty": "easy/medium/hard",
  "cuisine": "cuisine type",
  "course": "appetizer/main/dessert/etc",
  "tags": ["tag1", "tag2"],
  "ingredients": [
    {
      "section": "optional section name",
      "items": [
        {
          "ingredient": "name",
          "quantity": "amount",
          "unit": "unit",
          "preparation": "diced/minced/etc",
          "optional": false
        }
      ]
    }
  ],
  "instructions": [
    {
      "step": 1,
      "text": "instruction text",
      "duration": optional minutes,
      "temperature": "optional temp"
    }
  ],
  "notes": "optional notes",
  "tips": ["optional tips"]
}`;

const SUMMARIZE_INSTRUCTIONS_PROMPT = `Rewrite these recipe instructions to be clear and concise while preserving ALL critical information:
- Keep all temperatures exact
- Keep all timing information exact  
- Keep essential techniques
- Keep the critical order of operations
- Remove unnecessary narrative
- Combine related steps where logical
- Use imperative mood (e.g., "Mix" not "You should mix")`;

export async function parseRecipeFromText(text: string): Promise<RecipeData> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return generateMockRecipe(text);
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4-turbo-preview",
        messages: [
          { role: "system", content: PARSE_RECIPE_PROMPT },
          { role: "user", content: text },
        ],
        temperature: 0.3,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const recipeData = JSON.parse(data.choices[0].message.content);

    return validateAndCleanRecipeData(recipeData);
  } catch (error) {
    console.error("Error parsing recipe with AI:", error);
    return generateMockRecipe(text);
  }
}

export async function parseRecipeFromUrl(
  url: string,
): Promise<{ recipe: RecipeData; originalText: string }> {
  try {
    const htmlResponse = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; RecipeBot/1.0)",
        Accept: "text/html,application/xhtml+xml",
      },
    });

    if (!htmlResponse.ok) {
      throw new Error(`Failed to fetch URL: ${htmlResponse.statusText}`);
    }

    const html = await htmlResponse.text();
    const textContent = extractTextFromHtml(html);

    const recipe = await parseRecipeFromText(textContent);

    if (process.env.OPENAI_API_KEY) {
      recipe.instructions = await summarizeInstructions(recipe.instructions);
    }

    return { recipe, originalText: textContent };
  } catch (error) {
    console.error("Error parsing recipe from URL:", error);
    throw error;
  }
}

async function summarizeInstructions(instructions: RecipeData['instructions']): Promise<RecipeData['instructions']> {
  if (!process.env.OPENAI_API_KEY) {
    return instructions;
  }

  try {
    const instructionText = instructions
      .map((i: RecipeData['instructions'][0]) => `Step ${i.step}: ${i.text}`)
      .join("\n");

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: SUMMARIZE_INSTRUCTIONS_PROMPT },
          { role: "user", content: instructionText },
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      return instructions;
    }

    const data = await response.json();
    const summarized = data.choices[0].message.content;

    const lines = summarized.split("\n").filter((line: string) => line.trim());
    return lines.map((line: string, index: number) => ({
      step: index + 1,
      text: line.replace(/^(Step \d+:?\s*|\d+\.\s*)/i, "").trim(),
      duration: instructions[index]?.duration,
      temperature: instructions[index]?.temperature,
    }));
  } catch (error) {
    console.error("Error summarizing instructions:", error);
    return instructions;
  }
}

function extractTextFromHtml(html: string): string {
  const textWithoutTags = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

  return textWithoutTags.substring(0, 50000);
}

function validateAndCleanRecipeData(data: any): RecipeData {
  const cleaned: RecipeData = {
    summary: data.summary || "",
    description: data.description,
    servings: data.servings || { amount: 4 },
    times: data.times || {},
    difficulty: data.difficulty || "medium",
    cuisine: data.cuisine,
    course: data.course,
    tags: Array.isArray(data.tags) ? data.tags : [],
    ingredients: [],
    instructions: [],
    notes: data.notes,
    tips: Array.isArray(data.tips) ? data.tips : [],
  };

  if (Array.isArray(data.ingredients)) {
    cleaned.ingredients = data.ingredients
      .map((group: any) => ({
        section: group.section,
        items: Array.isArray(group.items)
          ? group.items.map((item: any) => ({
              ingredient: item.ingredient || "",
              quantity: item.quantity,
              unit: item.unit,
              preparation: item.preparation,
              optional: item.optional || false,
              alternatives: item.alternatives,
            }))
          : [],
      }))
      .filter((group: RecipeData['ingredients'][0]) => group.items.length > 0);
  }

  if (Array.isArray(data.instructions)) {
    cleaned.instructions = data.instructions.map(
      (inst: any, index: number) => ({
        step: inst.step || index + 1,
        text: inst.text || "",
        tip: inst.tip,
        warning: inst.warning,
        duration: inst.duration,
        temperature: inst.temperature,
      }),
    );
  }

  return cleaned;
}

function generateMockRecipe(text: string): RecipeData {
  const title = text.split("\n")[0]?.substring(0, 50) || "Untitled Recipe";

  return {
    summary: "A delicious recipe parsed from your input",
    servings: { amount: 4, unit: "servings" },
    times: { prep: 15, cook: 30, total: 45 },
    difficulty: "medium",
    tags: ["imported"],
    ingredients: [
      {
        items: [
          {
            ingredient: "Ingredients from your recipe",
            quantity: "As needed",
            unit: "",
          },
        ],
      },
    ],
    instructions: [
      {
        step: 1,
        text: "Follow the instructions from your original recipe.",
      },
    ],
    notes:
      "This is a placeholder recipe. Configure OpenAI API key for proper parsing.",
  };
}
