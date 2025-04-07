"use client";
import { saveQuizResult } from "@/actions/interview-action";
import { SaveQuizData } from "@/types/type";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useSaveQuizResult = () => {
  return useMutation({
    mutationFn: (data: SaveQuizData) =>
      saveQuizResult(data.questions, data.answers, data.score),
    onSuccess: () =>
      toast("Quiz Saved", {
        description: "Your quiz result has been saved successfully.",
      }),
    onError: (error) => console.error("Error saving quiz result", error),
  });
};
