import { getUserOnBoardingStatus } from "@/actions/user-actions";
import { redirect } from "next/navigation";
import React from "react";
import DashboardView from "./_components/dashboard-view";
import { getIndustryInsights } from "@/actions/dashboard-actions";

const Dashboard = async () => {
  const { isOnBoarding } = await getUserOnBoardingStatus();
  if (!isOnBoarding) {
    redirect("/onboarding");
  }
  const insights = await getIndustryInsights();

  return (
    <div>
      <DashboardView insights={insights} />
    </div>
  );
};

export default Dashboard;
