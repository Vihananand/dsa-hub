import { getQuestions } from "../../lib/questions";
import ProgressClient from "./progress-client";

// Force dynamic rendering and disable caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ProgressPage() {
  let questions = [];
  let error = null;

  try {
    questions = await getQuestions();
  } catch (e) {
    error = "Failed to load questions";
    console.error(e);
  }

  return <ProgressClient questions={questions} error={error} />;
}