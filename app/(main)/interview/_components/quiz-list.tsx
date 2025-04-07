"use client";
import { useState } from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import QuizResult from "./quiz-result";
import { Assessment, ConvertedQuizResultData } from "@/types/type";

interface QuizListProps {
  transformedAssessments: Assessment[];
}

export default function QuizList({ transformedAssessments }: QuizListProps) {
  const router = useRouter();
  const [selectedQuiz, setSelectedQuiz] = useState<Assessment | null>(null); // Wapas Assessment | null

  // Conversion function
  const convertToQuizResultData = (
    assessment: Assessment
  ): ConvertedQuizResultData => {
    return {
      quizScore: assessment.quizScore,
      improvementTip: assessment.improvementTip ?? undefined, // null ko undefined mein convert
      questions: assessment.questions.map((q) => ({
        questions: q.question, // QuizQuestionResult ke liye "questions" key
        answers: q.answer,
        userAnswer: q.userAnswer,
        isCorrect: q.isCorrect,
        explanation: q.explanation,
      })),
    };
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="gradient-title text-3xl md:text-4xl">
                Recent Quizzes
              </CardTitle>
              <CardDescription>
                Review your past quiz performance
              </CardDescription>
            </div>
            <Button onClick={() => router.push("/interview/mock")}>
              Start New Quiz
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transformedAssessments?.map((assessment, i) => (
              <Card
                key={assessment.id}
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setSelectedQuiz(assessment)} // Assessment set kar rahe hain
              >
                <CardHeader>
                  <CardTitle className="gradient-title text-2xl">
                    Quiz {i + 1}
                  </CardTitle>
                  <CardDescription className="flex justify-between w-full">
                    <div>Score: {assessment.quizScore.toFixed(1)}%</div>
                    <div>
                      {format(
                        new Date(assessment.createdAt),
                        "MMMM dd, yyyy HH:mm"
                      )}
                    </div>
                  </CardDescription>
                </CardHeader>
                {assessment.improvementTip && (
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {assessment.improvementTip}
                    </p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedQuiz} onOpenChange={() => setSelectedQuiz(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Quiz Result</DialogTitle>
          </DialogHeader>
          {selectedQuiz && (
            <QuizResult
              result={convertToQuizResultData(selectedQuiz)} // Conversion yahan hoti hai
              onStartNew={() => router.push("/interview/mock")}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
