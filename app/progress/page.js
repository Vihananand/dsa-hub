import { getQuestions } from "../../lib/questions";
import ProgressClient from "./progress-client";

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