/* eslint-disable react-hooks/rules-of-hooks */
'use client'
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FormField, Form, FormLabel, FormControl, FormItem, FormMessage } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import Pagination from "@/components/Pagination";
import { Category, DifficultyLevel, Question } from "@prisma/client";
import { analytics } from "@/utils/analytics";
import SearchQuestionTableUser from "../questions/SearchQuestionTable";

const searchFormSchema = z.object({
  keyword: z.string().optional(),
  difficultyLevel: z.enum(["EASY", "MEDIUM", "HARD"]).optional(),
  subject: z.string().optional(),
  topic: z.string().optional(),
});

type SearchFormValues = z.infer<typeof searchFormSchema>;

export default function SearchPage() {
  const { toast } = useToast();
  const [searchResults, setSearchResults] = useState<Question[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const difficultyLevel = [
    { id: '1', type: 'EASY' as DifficultyLevel },
    { id: '2', type: 'MEDIUM' as DifficultyLevel },
    { id: '3', type: 'HARD' as DifficultyLevel }
  ];

  const subjectCategory = categories.filter((category) => category.type === 'SUBJECT');
  const topicCategory = categories.filter((category) => category.type === 'TOPIC');

  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      keyword: "",
      difficultyLevel: undefined,
      subject: undefined,
      topic: undefined,
    },
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories', { method: 'GET' });

        if (!response.ok) {
          throw new Error(`Failed to load categories: ${response.statusText}`);
        }

        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast({ title: 'Error', description: 'Failed to load categories' });
      }
    };

    fetchCategories();
  }, [toast]);

  const onSubmit = async (data: SearchFormValues) => {
    setLoading(true);
    toast({
      title: "Searching...",
    });
    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      const questions = result.questions as Question[];
      setSearchResults(questions);
      toast({
        title: "Search Complete",
        description: "Your search results are ready.",
      });
    } catch (error) {
      toast({
        title: "Search Failed",
        description: "An error occurred while searching. Please try again.",
        variant: "destructive",
      });
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [questionsPerPage, setQuestionsPerPage] = useState(8);

  const lastQuestionIndex = currentPage * questionsPerPage;
  const firstQuestionIndex = lastQuestionIndex - questionsPerPage;
  const currentQuestions = searchResults.slice(firstQuestionIndex, lastQuestionIndex);

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex justify-center">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-wrap justify-between gap-4">
            <FormField
              control={form.control}
              name="keyword"
              render={({ field }) => (
                <FormItem className="flex-1 mt-2 w-[500px]">
                  <FormControl className="bg-blue-50 dark:bg-slate-900 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0">
                    <Input  {...field} placeholder="Search" className="text-xs font-semibold text-black dark:text-white" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem className='mt-2  mr-1'>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl className='bg-blue-50 dark:bg-slate-900 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0'>
                      <SelectTrigger className="text-xs font-semibold text-black dark:text-white">
                        <SelectValue placeholder="Select Subject" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="text-xs font-semibold text-black dark:text-white">
                      {subjectCategory.map((subject) => (
                        <SelectItem key={subject.id} value={subject.name}>{subject.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem className='mt-2  mr-1'>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl className='bg-blue-50 dark:bg-slate-900 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0'>
                      <SelectTrigger className="text-xs font-semibold text-black dark:text-white">
                        <SelectValue placeholder="Select Topic" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="text-xs font-semibold text-black dark:text-white">
                      {topicCategory.map((topic) => (
                        <SelectItem key={topic.id} value={topic.name}>{topic.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="difficultyLevel"
              render={({ field }) => (
                <FormItem className="flex-1 mt-2">
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl className="bg-blue-50 dark:bg-slate-900 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0">
                      <SelectTrigger className="text-xs font-semibold text-black dark:text-white">
                        <SelectValue placeholder="Select Difficulty Level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="text-xs font-semibold text-black dark:text-white">
                      {difficultyLevel.map((level) => (
                        <SelectItem key={level.id} value={level.type}>
                          {level.type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              onClick={() => analytics.track('Searching Questions')}
              type="submit"
              className="flex-shrink-0 mt-2 self-end"
              disabled={loading}
            >
              {loading ? "Searching..." : "Search"}
            </Button>
          </form>
        </Form>
      </div>

      {/* Search Results Table */}
      {searchResults.length > 0 && (
        <>
          <SearchQuestionTableUser currentQuestions={currentQuestions} limit={questionsPerPage} />
          {searchResults.length > questionsPerPage &&
            <Pagination totalItems={searchResults.length} itemsPerPage={questionsPerPage} currentPage={currentPage} setCurrentPage={setCurrentPage} />
          }
        </>
      )}

      {/* No Results Message */}
      {searchResults.length === 0 && !loading && (
        <div className="text-center mt-4 text-xs font-semibold text-black dark:text-white">
          No results found
        </div>
      )}
    </div>
  );
}
