"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormMessage, FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import BackButton from "@/components/BackButton";
import { useTheme } from "next-themes";
import withAuth from "@/hoc/withAuthUser";
import { useEffect } from "react";
import { Question, User } from "@prisma/client";
import { Spinner } from "@nextui-org/spinner";
import { Editor } from "primereact/editor";
import { getCurrentUser } from "@/utils/userClient";
import React from "react";
import { analytics } from "@/utils/analytics";

interface QuestionPracticeFormProps {
  params: {
    id: string;
    topicName: string;
  };
}

function DescriptiveQuestionPracticeForm({ params }: QuestionPracticeFormProps) {
  const [question, setQuestion] = useState<Question | null>(null);
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<boolean | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);  // Dialog visibility state

  let feedbackText = feedback ? "Correct" : "Incorrect";

  function stripHtmlTags(html: string) {
    return html.replace(/<\/?[^>]+(>|$)/g, "");
  }

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

  // Fetch question (for example)
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

  // This function evaluates the descriptive answer by comparing it with the expected answer
  const evaluateAnswer = (userAnswer: string) => {
    const expectedAnswer = question?.explanation?.toLowerCase() || "";

    // Split expectedAnswer into keywords (you can customize the keywords)
    const keywords = expectedAnswer.split(" ").filter((word) => word.length > 3); // Only consider words with >3 letters for comparison

    // Check how many keywords from expectedAnswer appear in userAnswer
    const matches = keywords.filter((keyword) =>
      userAnswer.toLowerCase().includes(keyword)
    );

    const matchPercentage = (matches.length / keywords.length) * 100;

    if (matchPercentage > 80) {
      return true;
    } else {
      return false;
    }
  };

  // Define the schema only after `question` is available
  const FormSchema = z.object({
    userAnswer: z.string().min(1, {
      message: "You need to provide an answer."
    }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const handleSubmit = async (data: z.infer<typeof FormSchema>) => {
    const isCorrect = evaluateAnswer(data.userAnswer);
    setFeedback(feedback);
    setDialogOpen(true);  // Open dialog box after feedback is generated

    const userID = user?.id;
    const questionID = question?.id;
    const userResponse = data.userAnswer;
    try {
      const response = await fetch('/api/questionPerformance/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({userResponse,userID,questionID,isCorrect}),
      });
      if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error: ${response.status} - ${errorText}`);
      }
      setFeedback(null);
    } catch (error) {
        toast({ title: 'An error occurred', description: 'Please try again later.' });
    }
  };

  if (loading) return <Spinner className="h-full flex items-center justify-center" />;
  if (!question) return <p>Question not found.</p>;

  return (
    <>
      <div className="w-1/6">
        <BackButton text="Go Back" link={`/user/topics/${params.topicName}`} />
      </div>
      <div className="h-full flex justify-center bg-blue-50 dark:bg-slate-900 rounded-lg">
        <div>
          <h3 className="text-2xl mb-1 text-center font-semibold font-serif border-0 focus-visible:ring-0 text-black p-1 rounded dark:text-white focus-visible:ring-offset-0">
            Descriptive Question
          </h3>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className=" border-0 focus-visible:ring-0 text-black p-3 rounded dark:text-white focus-visible:ring-offset-0"
            >
              <FormField
                control={form.control}
                name="userAnswer"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-xl text-blue-950 dark:text-white">
                      {question.question}
                    </FormLabel>
                    <FormControl className="w-[111vh]">
                      <Editor
                        value={field.value}
                        style={{
                          height: '130px',
                          paddingBottom: '2.6rem',
                          backgroundColor: isDarkMode ? '#020617' : '#FFFFFF',
                          color: isDarkMode ? 'white' : '#172554',
                          border: '0',
                          outline: 'none',
                          boxShadow: 'none',
                        }}
                        onTextChange={(e) => {
                          const strippedText = stripHtmlTags(e.htmlValue || '');
                          field.onChange(strippedText);
                        }}
                      />
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
                >
                  Submit
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>

      {/* Dialog for feedback */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Feedback</DialogTitle>
            <DialogDescription>
              <div className="mt-2 text-lg text-black dark:text-white">
              Your answer is evaluated as <strong className={feedback ? "text-green-600" : "text-red-600"}>{feedbackText}!</strong>
              </div>
            </DialogDescription>
          </DialogHeader>
          <p className="mt-4 text-black dark:text-white">Correct Answer: {question.explanation}</p>
          <DialogFooter>
            <Button onClick={() => setDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default withAuth(DescriptiveQuestionPracticeForm);
