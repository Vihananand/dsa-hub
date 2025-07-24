import { getQuestions } from "../../../lib/questions";
import AdminDashboardClient from "./admin-client";

// Force dynamic rendering and disable caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
