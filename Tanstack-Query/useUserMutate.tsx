"use client";
import { updateUser } from "@/actions/user-actions";
import { UpdateUserData } from "@/types/type";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useUserMutate = () => {
  return useMutation({
    mutationFn: (data: UpdateUserData) => updateUser(data),
    onSuccess: () =>
      toast("Profile Completed", {
        description: "You have successfully completed your profile",
      }),
    onError: (error) =>
      toast("Action Failed", {
        description: error?.message || "You have not completed your profile",
      }),
  });
};
