"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useGenerateQuizQuery } from "@/Tanstack-Query/useGenerateQuizQuery";
import { useSaveQuizResult } from "@/Tanstack-Query/useSaveQuizMutation";
import { Question } from "@/types/type";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import QuizResult from "./quiz-result";

const Quiz = () => {
  // Always call hooks at the top
  const { mutate: saveQuiz, data: resultData, isPending } = useSaveQuizResult();

  const [isQuizStarted, setIsQuizStarted] = useState<boolean>(false);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [savingResult, setSavingResult] = useState<boolean>(false);

  // Fetch quiz questions
  const { data, isLoading } = useGenerateQuizQuery({
    enabled: isQuizStarted,
  }) as {
    data: Question[] | undefined;
    isLoading: boolean;
  };

  // Initialize answers when quiz data loads
  useEffect(() => {
    if (data) {
      setAnswers(new Array(data.length).fill(""));
    }
  }, [data]);

  if (isLoading) {
    return <BarLoader className="mt-4" width={"100%"} color="gray" />;
  }

  // If no quiz data, show start screen
  if (!data || data.length === 0) {
    return (
      <Card className="mx-2">
        <CardHeader>
          <CardTitle>Ready to test your knowledge?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This quiz contains 10 questions specific to your industry and
            skills. Take your time and choose the best answer for each question.
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={() => setIsQuizStarted(true)} className="w-full">
            Start Quiz
          </Button>
        </CardFooter>
      </Card>
    );
  }

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < data.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowExplanation(false);
    } else {
      finishQuiz();
    }
  };

  const calculateScore = () => {
    let correct = 0;
    answers.forEach((answer, index) => {
      if (answer === data[index].correctAnswer) {
        correct++;
      }
    });
    return (correct / data.length) * 100;
  };

  const finishQuiz = () => {
    const score = calculateScore();
    setSavingResult(true);
    saveQuiz(
      { questions: data, answers, score },
      {
        onSuccess: () => {
          setSavingResult(false);
        },
        onError: (error) => {
          console.error("Error saving quiz result", error);
          setSavingResult(false);
        },
      }
    );
  };

  if (resultData) {
    return (
      <div className="mx-2">
        <QuizResult
          result={resultData}
          onStartNew={() => setIsQuizStarted(false)}
        />
      </div>
    );
  }

  const question = data[currentQuestion];

  return (
    <Card className="mx-2">
      <CardHeader>
        <CardTitle>
          Question {currentQuestion + 1} of {data.length}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-2">{question.question}</p>
        <RadioGroup
          onValueChange={handleAnswer}
          value={answers[currentQuestion]}
          className="space-y-2"
        >
          {question.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={`option-${index}`} />
              <Label htmlFor={`option-${index}`}>{option}</Label>
            </div>
          ))}
        </RadioGroup>
        {showExplanation && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="font-medium">Explanation:</p>
            <p className="text-muted-foreground">{question.explanation}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {!showExplanation && (
          <Button
            onClick={() => setShowExplanation(true)}
            variant="outline"
            disabled={!answers[currentQuestion]}
          >
            Show Explanation
          </Button>
        )}
        <Button
          onClick={handleNext}
          disabled={!answers[currentQuestion] || isPending}
          className="ml-auto"
        >
          {savingResult ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : currentQuestion < data.length - 1 ? (
            "Next Question"
          ) : (
            "Finish Quiz"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Quiz;
