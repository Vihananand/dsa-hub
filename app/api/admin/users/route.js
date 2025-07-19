import bcrypt from "bcrypt";
import pool from "../../db.js";
import { withAuth, AuthService, AdminService } from "../../auth.js";

/**
 * Create new admin user (Admin only)
 * POST /api/admin/users
 */
export const POST = withAuth(async function(request, { auth }) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return AuthService.createErrorResponse("Username and password are required", 400);
    }

    if (username.length < 3 || username.length > 50) {
      return AuthService.createErrorResponse("Username must be between 3 and 50 characters", 400);
    }

    if (password.length < 6) {
      return AuthService.createErrorResponse("Password must be at least 6 characters", 400);
    }

    // Check if username already exists
    const existingAdmin = await AdminService.findByUsername(username);
    if (existingAdmin) {
      return AuthService.createErrorResponse("Username already exists", 409);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create admin user
    const newAdmin = await AdminService.create(username, hashedPassword);
    
    console.log(`[ADMIN USERS] New admin created: ${username} by ${auth.username}`);

    return new Response(JSON.stringify({
      success: true,
      message: "Admin user created successfully",
      user: {
        id: newAdmin.id,
        username: newAdmin.username,
        created_at: newAdmin.created_at
      }
    }), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("[ADMIN USERS] Error creating admin:", error);
    return AuthService.createErrorResponse("Failed to create admin user", 500);
  }
});

/**
 * Get all admin users (Admin only)
 * GET /api/admin/users
 */
export const GET = withAuth(async function(request, { auth }) {
  try {
    const { rows } = await pool.query(
      "SELECT id, username, created_at FROM admin ORDER BY created_at DESC"
    );

    console.log(`[ADMIN USERS] Listed ${rows.length} admin users by ${auth.username}`);

    return new Response(JSON.stringify({
      success: true,
      users: rows
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("[ADMIN USERS] Error fetching admin users:", error);
    return AuthService.createErrorResponse("Failed to fetch admin users", 500);
  }
});

/**
 * Delete admin user (Admin only)
 * DELETE /api/admin/users
 */
export const DELETE = withAuth(async function(request, { auth }) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return AuthService.createErrorResponse("User ID is required", 400);
    }

    // Prevent self-deletion
    if (userId === auth.id) {
      return AuthService.createErrorResponse("Cannot delete your own account", 400);
    }

    const deletedAdmin = await AdminService.delete(userId);
    
    if (!deletedAdmin) {
      return AuthService.createErrorResponse("Admin user not found", 404);
    }

    console.log(`[ADMIN USERS] Admin deleted: ${deletedAdmin.username} by ${auth.username}`);

    return new Response(JSON.stringify({
      success: true,
      message: "Admin user deleted successfully",
      user: deletedAdmin
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("[ADMIN USERS] Error deleting admin:", error);
    return AuthService.createErrorResponse("Failed to delete admin user", 500);
  }
});
