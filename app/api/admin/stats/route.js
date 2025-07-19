import pool from "../../db.js";
import { withAuth, AuthService } from "../../auth.js";

/**
 * Get admin dashboard statistics
 * GET /api/admin/stats
 */
export const GET = withAuth(async function(request, { auth }) {
  try {
    console.log(`[ADMIN STATS] Fetching dashboard stats for ${auth.username}`);

    // Get question statistics
    const questionStats = await pool.query(`
      SELECT 
        COUNT(*) as total_questions,
        COUNT(CASE WHEN solved = true THEN 1 END) as solved_questions,
        COUNT(CASE WHEN difficulty = 'Easy' THEN 1 END) as easy_questions,
        COUNT(CASE WHEN difficulty = 'Medium' THEN 1 END) as medium_questions,
        COUNT(CASE WHEN difficulty = 'Hard' THEN 1 END) as hard_questions
      FROM questions
    `);

    // Get admin statistics
    const adminStats = await pool.query("SELECT COUNT(*) as total_admins FROM admin");

    // Get recent questions
    const recentQuestions = await pool.query(`
      SELECT question_title, difficulty, created_at 
      FROM questions 
      ORDER BY created_at DESC 
      LIMIT 5
    `);

    // Get difficulty distribution
    const difficultyStats = await pool.query(`
      SELECT 
        difficulty,
        COUNT(*) as count,
        COUNT(CASE WHEN solved = true THEN 1 END) as solved_count
      FROM questions 
      GROUP BY difficulty
      ORDER BY 
        CASE difficulty 
          WHEN 'Easy' THEN 1 
          WHEN 'Medium' THEN 2 
          WHEN 'Hard' THEN 3 
        END
    `);

    // Get topic distribution (top 10)
    const topicStats = await pool.query(`
      SELECT 
        unnest(topics) as topic,
        COUNT(*) as question_count
      FROM questions 
      WHERE topics IS NOT NULL AND array_length(topics, 1) > 0
      GROUP BY topic
      ORDER BY question_count DESC
      LIMIT 10
    `);

    const stats = {
      overview: questionStats.rows[0],
      admin_count: adminStats.rows[0].total_admins,
      recent_questions: recentQuestions.rows,
      difficulty_breakdown: difficultyStats.rows,
      popular_topics: topicStats.rows,
      last_updated: new Date().toISOString()
    };

    return new Response(JSON.stringify({
      success: true,
      stats
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("[ADMIN STATS] Error fetching stats:", error);
    return AuthService.createErrorResponse("Failed to fetch dashboard statistics", 500);
  }
});
