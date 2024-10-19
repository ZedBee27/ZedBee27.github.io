"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/use-toast";
import BackButton from "@/components/BackButton";
import { useTheme } from "next-themes";
import withAuth from "@/hoc/withAuthUser";
import { use, useEffect, useState } from "react";
import { Question, User } from "@prisma/client";
import { Spinner } from "@nextui-org/spinner";
import { getCurrentUser } from "@/utils/userClient";
import React from "react";
import { analytics } from "@/utils/analytics";

interface QuestionEditPageProps {
  params: {
    id: string;
    levelName: string;
  };
}

function QuestionPracticeForm({ params }: QuestionEditPageProps) {
  const [question, setQuestion] = useState<Question | null>(null);
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<boolean | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [coolDown, setCoolDown] = useState(false);
  const [timer, setTimer] = useState(60); // 1 minute timer

  useEffect(() => {
    const getUser = async () => {
      const user = await getCurrentUser();
      if (user) {
        setUser(user);
      } else {
        setUser(undefined);
      }
    }
    getUser();
  }, []);

  // Effect to handle the countdown logic for the coolDown timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (coolDown) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev === 1) {
            setCoolDown(false); // Reset coolDown
            setAttempts(0); // Reset attempts after coolDown
            setFeedback(null); // Reset feedback
            clearInterval(interval!); // Stop the timer
            return 60; // Reset timer
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [coolDown]);

  // Fetch the question data (mocked here for example)
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await fetch(`/api/questions/read/${params.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch question");
        }
        const data = await response.json();
        setQuestion(data);
      } catch (error) {
        console.error("Error fetching question:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [params.id]);

  const isDarkMode = useTheme().theme === "dark";

  // Define the form schema only after `question` is available
  const FormSchema = z.object({
    option: z.enum(
      [question?.option1, question?.option2, question?.option3, question?.option4] as [
        string,
        ...string[]
      ],
      {
        required_error: "You need to select an option.",
      }
    ),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  // Submission handler
  const handleSubmit = async (data: z.infer<typeof FormSchema>) => {
    const correctAnswer = question?.answer;
    const userAnswerCorrect = data.option === correctAnswer;

    if (userAnswerCorrect) {
      setFeedback(true);
      setAttempts(0); // Reset attempts on correct answer
    
    } else {
      setFeedback(false);
      setAttempts((prev) => prev + 1); // Increment attempts

      // Check if user has made 3 incorrect attempts
      if (attempts + 1 >= 3) {
        setCoolDown(true); // Start coolDown
      } else {
        null
      }
    }
    const isCorrect = userAnswerCorrect;
    const userID = user?.id;
    const questionID = question?.id;
    const userResponse = data.option;
    try {
      const response = await fetch('/api/questionPerformance/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({userResponse,userID,questionID,isCorrect}),
      });
      console.log(response);
      if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error: ${response.status} - ${errorText}`);
      }
  } catch (error) {
      toast({ title: 'An error occurred', description: 'Please try again later.' });
  }
  }

  if (loading) return <Spinner className="h-full flex items-center justify-center" />;
  if (!question) return <p>Question not found.</p>;

  return (
    <>
      <div className="w-1/6">
        <BackButton text="Go Back" link={`/user/difficultylevels/${params.levelName}`} />
      </div>
      <div className="h-full flex justify-center bg-blue-50 dark:bg-slate-900 rounded-lg">
        <div className="min-w-[116vh]">
          <h3 className="text-2xl mb-1 text-center font-semibold font-serif border-0 focus-visible:ring-0 text-black p-1 rounded dark:text-white focus-visible:ring-offset-0">
            Multiple Choice Question
          </h3>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="border-0 focus-visible:ring-0 text-black p-3 rounded dark:text-white focus-visible:ring-offset-0"
            >
              <FormField
                control={form.control}
                name="option"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-xl text-blue-950 dark:text-white">
                      {question.question}
                    </FormLabel>
                    <FormControl>
                        <RadioGroup
                          onValueChange={(value) => {
                            field.onChange(value);
                          }}
                          value={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value={question.option1 || ""} />
                            </FormControl>
                            <FormLabel className="text-xl text-blue-950 dark:text-white">
                              {question.option1}
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value={question.option2 || ""} />
                            </FormControl>
                            <FormLabel className="text-xl text-blue-950 dark:text-white">
                              {question.option2}
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value={question.option3 || ""} />
                            </FormControl>
                            <FormLabel className="text-xl text-blue-950 dark:text-white">
                              {question.option3}
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value={question.option4 || ""} />
                            </FormControl>
                            <FormLabel className="text-xl text-blue-950 dark:text-white">
                              {question.option4}
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className=" h-full flex justify-end">
                <Button
                  onClick={() => analytics.track('Question Practiced', {
                    question_id: question.id,
                    question: question.question,
                  })
                  }
                  type="submit"
                  className="mt-2 text-white dark:text-blue-950 font-semibold py-2 px-4 rounded text-lg"
                  disabled={coolDown} // Disable button during coolDown
                >
                  {coolDown ? `Wait ${timer}s` : "Submit"}
                </Button>
              </div>

              {/* Immediate Feedback */}
              {feedback === true && (
                <div className="mt-4 text-green-500 font-bold text-lg">
                  Correct! Well done.
                  <div className="mt-2 text-green-500 font-bold text-lg">
                    Explanation: {question.explanation}
                  </div>
                </div>
              )}
              {feedback === false && (
                <div className="mt-4 text-red-500 font-bold text-lg">
                  Incorrect! Try again.
                  {attempts == 3 && (
                    <>
                      <div className="mt-2 text-sm text-gray-500">
                        You have reached the maximum attempts. Try again in 1 minute.
                      </div>
                      <div className="mt-2 text-red-500 font-bold text-lg">
                        The correct answer is: {question.answer}
                      </div>
                      <div className="mt-2 text-red-500 font-bold text-lg">
                          Explanation: {question.explanation}
                      </div>
                    </>
                  )}
                </div>
              )}
            </form>
          </Form>
        </div>
      </div>
    </>
  );
}

export default withAuth(QuestionPracticeForm);