import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "../prisma";
import { inngest } from "./client";

const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
const model = genAi.getGenerativeModel({
  model: "gemini-1.5-flash",
});

export const generateIndustryInsights = inngest.createFunction(
  {
    id: "generate-industry-insights",
    name: "Generate Industry Insights",
  },
  { cron: "0 0 * * 0" },
  async ({ step }) => {
    const industries = await step.run("Fetch industries", async () => {
      return await db.industryInsight.findMany({
        select: { industry: true },
      });
    });

    for (const industry of industries) {
      const prompt = `
      Analyze the current state of the ${industry} industry and provide insights in the EXACT JSON format specified below without any additional text, explanations, or markdown formatting.
      
      The JSON should follow this schema:
      {
        "salaryRanges": [
          { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
        ],
        "growthRate": number, // Represented as a percentage (e.g., 3.5 for 3.5%)
        "demandLevel": "High" | "Medium" | "Low",
        "topSkills": [ "string", ... ], // At least 5 skills
        "marketOutlook": "Positive" | "Neutral" | "Negative",
        "keyTrends": [ "string", ... ], // At least 5 trends
        "recommendedSkills": [ "string", ... ] // At least 5 recommended skills
      }
      
      IMPORTANT:
      - Return ONLY the JSON object as per the schema.
      - Do not include any commentary, markdown formatting, or additional notes.
      - Ensure that "salaryRanges" includes at least 5 common roles with realistic salary data.
      - "growthRate" should be a realistic percentage value.
      - Populate "topSkills", "keyTrends", and "recommendedSkills" with at least 5 relevant items each.
    `;
      const res = step.ai.wrap(
        "gemini",
        async (p) => {
          return await model.generateContent(p);
        },
        prompt
      );

      const part =
        (await res)?.response?.candidates?.[0]?.content?.parts?.[0] ?? null;
      let text = "";
      if (part && "text" in part) {
        text = (part as { text: string }).text;
      }
      const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
      const insights = JSON.parse(cleanedText);

      await step.run(`Update ${industry} insights`, async () => {
        await db.industryInsight.update({
          where: { industry: industry.industry },
          data: {
            ...insights,
            lastUpdated: new Date(),
            nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        });
      });
    }
  }
);
