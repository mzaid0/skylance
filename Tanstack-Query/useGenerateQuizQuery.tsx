"use client";
import { generateQuiz } from "@/actions/interview-action";
import { useQuery } from "@tanstack/react-query";

export const useGenerateQuizQuery = (options: { enabled: boolean }) => {
  return useQuery({
    queryKey: ["generateQuiz"],
    queryFn: generateQuiz,
    enabled: options.enabled,
  });
};