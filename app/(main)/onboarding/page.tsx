import { getUserOnBoardingStatus } from "@/actions/user-actions";
import { redirect } from "next/navigation";
import React from "react";
import OnBoardingForm from "./_components/onboarding-form";

const OnBoarding = async () => {
  const { isOnBoarding } = await getUserOnBoardingStatus();
  if (isOnBoarding) {
    redirect("/dashboard");
  }
  return <OnBoardingForm />;
};

export default OnBoarding;
