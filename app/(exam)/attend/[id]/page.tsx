'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { toast } from '@/components/ui/use-toast'
import withAuth from '@/hoc/withAuthUser'
import { Exam, Question, User } from '@prisma/client'
import { Spinner } from '@nextui-org/spinner'
import { useTheme } from "next-themes";
import { Editor } from 'primereact/editor'
import { getCurrentUser } from '@/utils/userClient'
import { debounce } from 'lodash'
import { useRouter } from 'next/navigation'
import React from 'react'


interface QuestionEditPageProps {
  params: {
    id: string
  }
}

function QuestionPracticeForm({ params }: QuestionEditPageProps) {
  const [exam, setExam] = useState<Exam | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [user, setUser] = useState<User>()
  const [loading, setLoading] = useState(true)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [isAnswerSaved, setIsAnswerSaved] = useState(false)
  const router = useRouter()

  const isDarkMode = useTheme().theme === "dark";

  function stripHtmlTags(html: string) {
    return html.replace(/<\/?[^>]+(>|$)/g, "");
  }
  
  const FormSchema = z.object({
    answers: z.array(z.object({
      id: z.string(),
      type: z.enum(['MCQ', 'DESCRIPTIVE']),
      answer: z.string().optional()
    }))
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      answers: []
    }
  });

  // Throttled timer function to reduce excessive renders
  const updateTimer = useCallback(() => {
    setTimeLeft(prevTime => (prevTime !== null && prevTime > 0 ? prevTime - 1 : 0));
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const user = await getCurrentUser();
        if (!user) {
          throw new Error('User not found');
        }
        setUser(user);

        const questionsResponse = await fetch('/api/questions');
        const questionsData = await questionsResponse.json();
        setQuestions(questionsData);

        const examResponse = await fetch(`/api/exams/read/${params.id}`);
        const examData = await examResponse.json();
        setExam(examData);
        setTimeLeft(examData.duration * 60);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to load data. Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [params.id]);


  const examQuestions = exam?.question_ids || [];
  const practiceQuestions = [...questions].filter((question) => examQuestions.includes(question.id));

  const onSubmit = useCallback(async (data: z.infer<typeof FormSchema>) => {
    const correctAnswers = data.answers.filter(answer => {
      const question = questions.find(q => q.id === answer.id);
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
      if (question?.type === 'MCQ') {
        return question?.answer === answer.answer;
      } else {
        // Custom logic to evaluate descriptive answers
        return evaluateAnswer(answer.answer || '');
      }
    }).length;

    const isCorrect = data.answers.map(answer => {
      const question = questions.find(q => q.id === answer.id);
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
      if (question?.type === 'MCQ') {
        return question?.answer === answer.answer;
      } else {
        // Custom logic to evaluate descriptive answers
        return evaluateAnswer(answer.answer || '');
      }
    });

    const totalQuestions = practiceQuestions.length;
    const percentageScore = (correctAnswers / totalQuestions) * 100;
    
    const timeTaken = (exam?.duration ?? 0) * 60 - (timeLeft ?? 0);

    const payload = {
      userId: user?.id,
      examId: exam?.id,
      answers: data.answers.map((answer, index) => ({
        id: answer.id,
        type: answer.type,
        isCorrect: isCorrect[index],
        answer: answer.answer
      })),
      score: percentageScore,
      correctAnswers: correctAnswers,
      timeTaken: timeTaken/60,
    };

    try {
      const response = await fetch('/api/exam/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error('Failed to save exam');
      toast({ title: "Success", description: "Exam results saved successfully." });
      router.push('/user/simulatedExams');
    } catch (error) {
      toast({ title: "Error", description: "Failed to save exam results." });
    }
  }, [exam?.duration, exam?.id, practiceQuestions,questions, router,timeLeft, user?.id]);

  // Timer effect to update every second
  useEffect(() => {
    if (exam && timeLeft !== null && timeLeft > 0) {
      const timer = setInterval(updateTimer, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      form.handleSubmit(onSubmit)(); // Auto-submit when time runs out
      router.push('/user/simulatedExams');
    }
  }, [exam, timeLeft, updateTimer, router, form, onSubmit]);

  useEffect(() => {
    if (exam) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime !== null && prevTime > 1) {
            return prevTime - 1;
          } else {
            clearInterval(timer);
            form.handleSubmit(onSubmit);
            return 0
          }
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [exam, form, onSubmit]);



  // Memoize the debounce function to avoid recreating it on every render
  const saveAnswer = useMemo(() => debounce(() => {
    const currentAnswer = form.getValues(`answers.${currentQuestionIndex}.answer`);
    const currentType = form.getValues(`answers.${currentQuestionIndex}.type`);

    if (currentType === 'DESCRIPTIVE' && !currentAnswer) {
      form.setValue(`answers.${currentQuestionIndex}.answer`, 'blank');
    }
    if (currentType === 'MCQ' && !currentAnswer) {
      form.setValue(`answers.${currentQuestionIndex}.answer`, '');
    }

    form.trigger(`answers.${currentQuestionIndex}.answer`).then((isValid) => {
      if (isValid) {
        setIsAnswerSaved(true);
        toast({ title: "Answer Saved", description: "Your answer has been saved." });
      } else {
        toast({ title: "Answer Not Saved", description: "Please answer before proceeding." });
      }
    });
  }, 1000), [currentQuestionIndex, form]);

  if (loading) {
    return <Spinner className='h-full flex items-center justify-center' />
  }

  if (!exam) {
    return <div>Exam not found. Please check the URL or try again later.</div>
  }

  const getTimerColor = () => {
    if (timeLeft !== null && timeLeft < exam.duration * 1) return 'text-red-500';
    if (timeLeft !== null && timeLeft < exam.duration * 1.5) return 'text-yellow-500';
    return 'text-green-500';
  };

  const goToNextQuestion = () => {
    if (isAnswerSaved && currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setIsAnswerSaved(false);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setIsAnswerSaved(false);
    }
  };

  return (
    <>
      <div className='bg-blue-50 dark:bg-slate-900'>
        <h3 className="text-2xl mb-1 font-semibold font-serif border-0 focus-visible:ring-0 text-black p-3 rounded dark:text-white focus-visible:ring-offset-0">
          {exam.name}
        </h3>
        <div className="flex flex-row justify-between items-center">
          <h4 className={`text-xl text-center ml-72 font-bold ${getTimerColor()}`}>
        Time Left: {Math.floor((timeLeft ?? 0) / 60)}m {(timeLeft ?? 0) % 60}s
          </h4>

          <div className="mr-2">
          <div>
            {practiceQuestions.map((_, index) => (
          <Button
            key={index}
            onClick={() => setCurrentQuestionIndex(index)}
            className={`mx-1 ${currentQuestionIndex === index ? 'bg-blue-950' : 'bg-blue-700'} text-white py-1 px-2 rounded`}
          >
            {index + 1}
          </Button>
            ))}
          </div>
          </div>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='border-0 focus-visible:ring-0 text-black p-3 rounded dark:text-white focus-visible:ring-offset-0'>
        {practiceQuestions
          .sort((a, b) => b.type.localeCompare(a.type)) // Sort questions by type
          .slice(currentQuestionIndex, currentQuestionIndex + 1)
          .map((practiceQuestion) => (
          <FormField
            key={practiceQuestion.id}
            control={form.control}
            name={`answers.${currentQuestionIndex}.id`}
            render={({ field }) => (
          <FormItem>
            <div>
              {(() => {
            if (form.watch(`answers.${currentQuestionIndex}.id`) === undefined) {
              form.setValue(`answers.${currentQuestionIndex}.id`, practiceQuestion.id);
              return null;
            }
            return null;
              })()}
            </div>
            <FormField
              key={practiceQuestion.id}
              control={form.control}
              name={`answers.${currentQuestionIndex}.type`}
              render={({ field }) => (     
            <FormItem>
              <div>
                {(() => {
              if (form.watch(`answers.${currentQuestionIndex}.type`) === undefined) {
                form.setValue(`answers.${currentQuestionIndex}.type`, practiceQuestion.type);
                return null;
              }
              return null;
                })()}
              </div>
              <FormField
                key={practiceQuestion.id}
                control={form.control}
                name={`answers.${currentQuestionIndex}.answer`}
                render={({ field }) => (
              <FormItem>
                <FormLabel className='text-lg'>Question {currentQuestionIndex + 1}: {practiceQuestion.question}</FormLabel>
                <FormControl className='m-2 mx-5'>
                  {practiceQuestion.type === 'MCQ' ? (
                <RadioGroup
                onValueChange={(value) => {
                  field.onChange(value);
                }}
                value={field.value}
                className="flex flex-col space-y-1"
                  >
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value={practiceQuestion.option1 || ""} />
                  </FormControl>
                  <FormLabel className="text-xl text-blue-950 dark:text-white">
                    {practiceQuestion.option1}
                  </FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value={practiceQuestion.option2 || ""} />
                  </FormControl>
                  <FormLabel className="text-xl text-blue-950 dark:text-white">
                    {practiceQuestion.option2}
                  </FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value={practiceQuestion.option3 || ""} />
                  </FormControl>
                  <FormLabel className="text-xl text-blue-950 dark:text-white">
                    {practiceQuestion.option3}
                  </FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value={practiceQuestion.option4 || ""} />
                  </FormControl>
                  <FormLabel className="text-xl text-blue-950 dark:text-white">
                    {practiceQuestion.option4}
                  </FormLabel>
                </FormItem>
                  </RadioGroup>
                  ) : (
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
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
                )}
              />
            </FormItem>
              )}
            />
          </FormItem>
            )}
          />
        ))}
            <div className=' h-full flex justify-end items-end mt-24'>
              <div>
                <Button
                  type="button"
                  onClick={goToPreviousQuestion}
                  disabled={currentQuestionIndex === 0 || isAnswerSaved === false}
                  className="mt-4 ml-2"
                >
                  Previous
                </Button>

                <Button
                  type="button"
                  onClick={() => {
                    saveAnswer(); // Save answer on button click
                  }}
                  className="mt-4 ml-2"
                >
                  Save
                </Button>

                <Button
                  type="button"
                  onClick={goToNextQuestion}
                  disabled={currentQuestionIndex === (practiceQuestions.length - 1) || isAnswerSaved === false}
                  className="mt-4 ml-2"
                >
                  Next
                </Button>
                
                <Button
                  type="submit"
                  className="mt-4 ml-2"
                >
                  Finish
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}

export default withAuth(QuestionPracticeForm);
