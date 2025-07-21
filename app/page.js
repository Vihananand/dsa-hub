import { getLatestQuestions, getTotalQuestionCount } from "../lib/questions";
import HomeClient from "./home-client";

export default async function Home() {
  let questions = [];
  let totalCount = 0;
  let error = null;

  try {
    const [latestQuestions, count] = await Promise.all([
      getLatestQuestions(4),
      getTotalQuestionCount()
    ]);
    questions = latestQuestions;
    totalCount = count;
  } catch (e) {
    error = "Failed to load questions";
    console.error(e);
  }

  return <HomeClient questions={questions} totalCount={totalCount} error={error} />;
}