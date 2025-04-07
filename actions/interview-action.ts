"use server";
import { db } from "@/lib/prisma";
import { Answers, Question, Score } from "@/types/type";
import { auth } from "@clerk/nextjs/server";
import {
  GoogleGenerativeAI,
  GenerateContentResult,
} from "@google/generative-ai";

const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
const model = genAi.getGenerativeModel({
  model: "gemini-1.5-flash",
});

export const generateQuiz = async (): Promise<Question[]> => {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Not authenticated");
    }
    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });
    if (!user) {
      throw new Error("User not found");
    }

    const prompt = `
    Generate 10 technical interview questions for a ${
      user.industry
    } professional${
      user.skills?.length ? ` with expertise in ${user.skills.join(", ")}` : ""
    }.
    
    Each question should be multiple choice with 4 options.
    
    Return the response in this JSON format only, no additional text:
    {
      "questions": [
        {
          "question": "string",
          "options": ["string", "string", "string", "string"],
          "correctAnswer": "string",
          "explanation": "string"
        }
      ]
    }
  `;

    const result: GenerateContentResult = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
    const quiz = JSON.parse(cleanedText);

    return quiz.questions;
  } catch (error) {
    console.error("Error generating quiz", error);
    throw new Error("Failed to generate quiz");
  }
};

export const saveQuizResult = async (
  questions: Question[],
  answers: Answers,
  score: Score
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Not authenticated");
  }
  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });
  if (!user) {
    throw new Error("User not found");
  }

  const questionResult = questions.map((q, index) => ({
    questions: q.question,
    answers: q.correctAnswer,
    userAnswer: answers[index],
    isCorrect: q.correctAnswer === answers[index],
    explanation: q.explanation,
  }));

  let improvementTip = null;
  const wrongAnswers = questionResult.filter((q) => !q.isCorrect);

  if (wrongAnswers.length > 0) {
    const wrongQuestionsText = wrongAnswers
      .map(
        (q) =>
          `Question: "${q.questions}"\nCorrect Answer: "${q.answers}"\nUser Answer: "${q.userAnswer}"`
      )
      .join("\n\n");

    const improvementPrompt = `
      The user got the following ${user.industry} technical interview questions wrong:

      ${wrongQuestionsText}

      Based on these mistakes, provide a concise, specific improvement tip.
      Focus on the knowledge gaps revealed by these wrong answers.
      Keep the response under 2 sentences and make it encouraging.
      Don't explicitly mention the mistakes, instead focus on what to learn/practice.
    `;

    try {
      const result: GenerateContentResult = await model.generateContent(
        improvementPrompt
      );
      const response = result.response;
      improvementTip = response.text().trim();
    } catch (error) {
      console.error("Error generating improvement tip", error);
      throw new Error("Failed to generate improvement tip");
    }
  }

  try {
    const assessment = await db.assessment.create({
      data: {
        userId: user.id,
        quizScore: score,
        questions: questionResult,
        category: "Technical",
        improvementTip,
      },
    });
    return assessment;
  } catch (error) {
    console.error("Error saving quiz result", error);
    throw new Error("Failed to save quiz result");
  }
};

export async function getAssessments() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  try {
    const assessments = await db.assessment.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return assessments;
  } catch (error) {
    console.error("Error fetching assessments:", error);
    throw new Error("Failed to fetch assessments");
  }
}
