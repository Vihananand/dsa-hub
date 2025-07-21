import pool from "../app/api/db";

export async function getQuestions() {
  try {
    const { rows } = await pool.query("SELECT * FROM leetcodelinks ORDER BY serial ASC");
    return rows;
  } catch (error) {
    console.error("[QUESTIONS LIB] Database connection error:", {
      message: error.message,
      code: error.code,
      detail: error.detail,
      stack: error.stack
    });
    throw new Error("Failed to fetch questions");
  }
}

export async function getLatestQuestions(limit = 4) {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM leetcodelinks ORDER BY serial DESC LIMIT $1", 
      [limit]
    );
    return rows;
  } catch (error) {
    console.error("[QUESTIONS LIB] Database connection error:", {
      message: error.message,
      code: error.code,
      detail: error.detail,
      stack: error.stack
    });
    throw new Error("Failed to fetch latest questions");
  }
}

export async function getTotalQuestionCount() {
  try {
    const { rows } = await pool.query("SELECT COUNT(*) FROM leetcodelinks");
    return parseInt(rows[0].count, 10);
  } catch (error) {
    console.error("[QUESTIONS LIB] Database connection error:", {
      message: error.message,
      code: error.code,
      detail: error.detail,
      stack: error.stack
    });
    throw new Error("Failed to fetch question count");
  }
}

export async function createQuestion(questionData) {
  try {
    const { serial, title, questionlink, topic, difficulty } = questionData;
    const { rows } = await pool.query(
      "INSERT INTO leetcodelinks (serial, title, questionlink, topic, difficulty) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [serial, title, questionlink, topic, difficulty]
    );
    return rows[0];
  } catch (error) {
    console.error("[QUESTIONS LIB] Database connection error:", {
      message: error.message,
      code: error.code,
      detail: error.detail,
      stack: error.stack
    });
    throw new Error("Failed to create question");
  }
}

export async function updateQuestion(serial, questionData) {
  try {
    const { title, questionlink, topic, difficulty } = questionData;
    const { rows } = await pool.query(
      "UPDATE leetcodelinks SET title = $1, questionlink = $2, topic = $3, difficulty = $4 WHERE serial = $5 RETURNING *",
      [title, questionlink, topic, difficulty, serial]
    );
    return rows[0];
  } catch (error) {
    console.error("[QUESTIONS LIB] Database connection error:", {
      message: error.message,
      code: error.code,
      detail: error.detail,
      stack: error.stack
    });
    throw new Error("Failed to update question");
  }
}

export async function deleteQuestion(serial) {
  try {
    const { rows } = await pool.query(
      "DELETE FROM leetcodelinks WHERE serial = $1 RETURNING *",
      [serial]
    );
    return rows[0];
  } catch (error) {
    console.error("[QUESTIONS LIB] Database connection error:", {
      message: error.message,
      code: error.code,
      detail: error.detail,
      stack: error.stack
    });
    throw new Error("Failed to delete question");
  }
}
