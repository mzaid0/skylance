"use server";
import { db } from "@/lib/prisma";
import { UpdateUserData } from "@/types/type";
import { auth } from "@clerk/nextjs/server";
import { generateAiInsights } from "./dashboard-actions";

export const updateUser = async (data: UpdateUserData) => {
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

  try {
    const result = await db.$transaction(async (tx) => {
      let industryInsight = await tx.industryInsight.findUnique({
        where: { industry: data.industry },
      });
      if (!industryInsight) {
        const insights = await generateAiInsights(data.industry);
        industryInsight = await db.industryInsight.create({
          data: {
            industry: data.industry,
            ...insights,
            nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        });
      }

      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: {
          industry: data.industry,
          experience: Number(data.experience),
          bio: data.bio,
          skills: data.skills,
        },
      });
      return { updatedUser, industryInsight };
    });

    return { success: true, ...result };
  } catch (error) {
    console.error("Error updating user", error);
    throw new Error("Failed to update user");
  }
};

export const getUserOnBoardingStatus = async () => {
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

  try {
    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
      select: {
        industry: true,
      },
    });

    return { success: true, isOnBoarding: !!user?.industry };
  } catch (error) {
    console.error("Error getting user onboarding status", error);
    throw new Error("Failed to get user onboarding status");
  }
};
