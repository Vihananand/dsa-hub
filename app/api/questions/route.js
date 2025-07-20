import pool from "../db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET;

function authenticate() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) {
      return false;
    }
    jwt.verify(token, JWT_SECRET);
    return true;
  } catch (error) {
    console.error("[QUESTIONS AUTH] Token verification failed:", error.message);
    return false;
  }
}

export async function GET(req) {
  try {
    // Test database connection
    const { rows } = await pool.query("SELECT * FROM leetcodelinks ORDER BY serial ASC");
    return Response.json(rows);
  } catch (e) {
    console.error("[QUESTIONS API] Database connection error:", {
      message: e.message,
      code: e.code,
      detail: e.detail,
      stack: e.stack
    });
    return Response.json({ error: "Failed to fetch questions" }, { status: 500 });
  }
}

export async function POST(req) {
  if (!authenticate()) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  try {
    const body = await req.json();
    
    const { serial, title, difficulty, topic, questionlink, solutionlink } = body;
    
    if (!serial || !title || !difficulty || !topic || !questionlink) {
      return Response.json({ error: "Missing fields" }, { status: 400 });
    }
    
    const result = await pool.query(
      "INSERT INTO leetcodelinks (serial, title, difficulty, topic, questionlink, solutionlink) VALUES ($1, $2, $3, $4, $5, $6) RETURNING serial",
      [serial, title, difficulty, topic, questionlink, solutionlink || null]
    );
    
    return Response.json({ success: true, serial: result.rows[0]?.serial });
  } catch (e) {
    console.error("[QUESTIONS API] Detailed error:", {
      message: e.message,
      code: e.code,
      detail: e.detail,
      constraint: e.constraint,
      stack: e.stack
    });
    return Response.json({ error: `Failed to add question: ${e.message}` }, { status: 500 });
  }
}

export async function PUT(req) {
  if (!authenticate()) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { serial, title, difficulty, topic, questionlink, solutionlink } = await req.json();
  if (!serial) return Response.json({ error: "Missing serial" }, { status: 400 });
  try {
    await pool.query(
      "UPDATE leetcodelinks SET title=$1, difficulty=$2, topic=$3, questionlink=$4, solutionlink=$5 WHERE serial=$6",
      [title, difficulty, topic, questionlink, solutionlink, serial]
    );
    return Response.json({ success: true });
  } catch (e) {
    console.error("[QUESTIONS API] Error updating question:", e);
    return Response.json({ error: "Failed to update question" }, { status: 500 });
  }
}

export async function DELETE(req) {
  if (!authenticate()) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { serial } = await req.json();
  if (!serial) return Response.json({ error: "Missing serial" }, { status: 400 });
  try {
    await pool.query("DELETE FROM leetcodelinks WHERE serial=$1", [serial]);
    return Response.json({ success: true });
  } catch (e) {
    console.error("[QUESTIONS API] Error deleting question:", e);
    return Response.json({ error: "Failed to delete question" }, { status: 500 });
  }
} 