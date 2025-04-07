import { getAssessments } from "@/actions/interview-action";
import StatsCards from "./_components/stats-cards";
import { Assessment, AssessmentQuestion } from "@/types/type";
import PerformanceChart from "./_components/performace-chart";
import QuizList from "./_components/quiz-list";

const Interview = async () => {
  const assessmentsFromDb = await getAssessments();

  const transformedAssessments: Assessment[] = assessmentsFromDb.map((a) => ({
    ...a,
    questions: a.questions as unknown as AssessmentQuestion[],
  }));

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-6xl font-bold gradient-title">
          Interview Preparation
        </h1>
      </div>
      <div className="space-y-6">
        <StatsCards assessments={transformedAssessments} />
        <PerformanceChart transformedAssessments={transformedAssessments} />
        <QuizList transformedAssessments={transformedAssessments} />
      </div>
    </div>
  );
};

export default Interview;
