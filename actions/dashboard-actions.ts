"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
const model = genAi.getGenerativeModel({
  model: "gemini-1.5-flash",
});

export const generateAiInsights = async (industry: string) => {
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

  const result = model.generateContent(prompt);

  const response = (await result).response;
  const text = response.text();
  const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
  return JSON.parse(cleanedText);
};

export const getIndustryInsights = async () => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Not authenticated");
  }
  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
    include: { industryInsight: true },
  });
  if (!user) {
    throw new Error("User not found");
  }

  if (!user.industryInsight) {
    if (!user.industry) {
      throw new Error("User industry is not defined");
    }
    const insights = await generateAiInsights(user.industry);
    const industryInsight = await db.industryInsight.create({
      data: {
        industry: user.industry,
        ...insights,
        nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });
    return industryInsight;
  }
  return user.industryInsight;
};
