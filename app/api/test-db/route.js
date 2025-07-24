import pool from "../db";

export async function GET() {
  try {
    // Test basic database connectivity
    const { rows: countRows } = await pool.query('SELECT COUNT(*) as total FROM leetcodelinks');
    const totalQuestions = countRows[0].total;

    // Get latest question serial number
    const { rows: latestRows } = await pool.query('SELECT MAX(serial) as latest FROM leetcodelinks');
    const latestSerial = latestRows[0].latest;

    // Get count of complete questions
    const { rows: completeRows } = await pool.query(`
      SELECT COUNT(*) as complete FROM leetcodelinks 
      WHERE title IS NOT NULL 
        AND title != '' 
        AND difficulty IS NOT NULL 
        AND difficulty != '' 
        AND topic IS NOT NULL 
        AND topic != '' 
        AND questionlink IS NOT NULL 
        AND questionlink != ''
    `);
    const completeQuestions = completeRows[0].complete;

    // Get last 3 questions
    const { rows: recentRows } = await pool.query(`
      SELECT serial, title, difficulty, topic 
      FROM leetcodelinks 
      ORDER BY serial DESC 
      LIMIT 3
    `);

    const response = Response.json({
      success: true,
      timestamp: new Date().toISOString(),
      database: {
        totalQuestions: parseInt(totalQuestions),
        latestSerial: parseInt(latestSerial),
        completeQuestions: parseInt(completeQuestions),
        recentQuestions: recentRows
      },
      environment: process.env.NODE_ENV
    });

    // Prevent caching
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;
  } catch (error) {
    console.error("[TEST-DB] Database error:", error);
    return Response.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV
    }, { status: 500 });
  }
}
