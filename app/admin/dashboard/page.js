import { getQuestions } from "../../../lib/questions";
import AdminDashboardClient from "./admin-client";

export default async function AdminDashboard() {
  let questions = [];
  let error = null;

  try {
    questions = await getQuestions();
  } catch (e) {
    error = "Failed to load questions";
    console.error(e);
  }

  return <AdminDashboardClient initialQuestions={questions} error={error} />;
}
