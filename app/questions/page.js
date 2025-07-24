import { getQuestions } from "../../lib/questions";
import QuestionsClient from "./questions-client";

// Force dynamic rendering and disable caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function QuestionsPage() {
  let questions = [];
  let error = null;

  try {
    questions = await getQuestions();
  } catch (e) {
    error = "Failed to load questions";
    console.error(e);
  }

  return <QuestionsClient questions={questions} error={error} />;
}
