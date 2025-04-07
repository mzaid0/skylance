import { UserPlus, FileEdit, Users, LineChart } from "lucide-react";
import React from "react";

export const howItWorks = [
  {
    title: "Professional Onboarding",
    description: "Share your industry and expertise for personalized guidance",
    icon: React.createElement(UserPlus, {
      className: "w-8 h-8 text-primary",
    }),
  },
  {
    title: "Craft Your Documents",
    description: "Create ATS-optimized resumes and compelling cover letters",
    icon: React.createElement(FileEdit, {
      className: "w-8 h-8 text-primary",
    }),
  },
  {
    title: "Prepare for Interviews",
    description:
      "Practice with AI-powered mock interviews tailored to your role",
    icon: React.createElement(Users, {
      className: "w-8 h-8 text-primary",
    }),
  },
  {
    title: "Monitor Improvements",
    description: "Monitor improvements with detailed performance analytics",
    icon: React.createElement(LineChart, {
      className: "w-8 h-8 text-primary",
    }),
  },
];
