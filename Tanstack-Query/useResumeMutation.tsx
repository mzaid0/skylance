"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { saveResume, improveWithAI } from "@/actions/resume-actions"; // adjust the path as needed

// Hook to save the resume
export const useSaveResumeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) => saveResume(content),
    onSuccess: () => {
      toast.success("Resume saved successfully!");
      // Invalidate resume queries if you have a query for fetching resume data.
      queryClient.invalidateQueries({ queryKey: ["resume"] });
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to save resume");
    },
  });
};

// Hook to improve the entry description using AI
export const useImproveWithAIMutation = () => {
  return useMutation({
    mutationFn: (data: { current: string; type: string }) =>
      improveWithAI(data),
    onSuccess: () => {
      toast.success("Description improved successfully!");
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to improve description");
    },
  });
};
