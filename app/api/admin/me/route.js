import bcrypt from "bcrypt";
import { AuthService, AdminService } from "../../auth.js";

/**
 * Get Current Admin User Profile
 * GET /api/admin/me
 */
export async function GET(request) {
  try {
    console.log("[AUTH CHECK] Checking authentication...");
    
    // Authenticate request
    const auth = await AuthService.authenticate(request);
    console.log(`[AUTH CHECK] Authentication successful for user: ${auth.username}`);

    // Get fresh profile data
    const profile = await AdminService.getProfile(auth.id);
    if (!profile) {
      console.log(`[AUTH CHECK] Profile not found for user ID: ${auth.id}`);
      return AuthService.createErrorResponse("User profile not found", 404);
    }

    return new Response(JSON.stringify({
      authenticated: true,
      user: {
        id: profile.id,
        username: profile.username,
        created_at: profile.created_at
      }
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.log(`[AUTH CHECK] Authentication failed: ${error.message}`);
    return AuthService.createErrorResponse(error.message, 401);
  }
}

/**
 * Update Admin Profile
 * PATCH /api/admin/me
 */
export async function PATCH(request) {
  try {
    const auth = await AuthService.authenticate(request);
    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return AuthService.createErrorResponse("Current password and new password are required", 400);
    }

    if (newPassword.length < 6) {
      return AuthService.createErrorResponse("New password must be at least 6 characters", 400);
    }

    // Get current admin data
    const admin = await AdminService.findByUsername(auth.username);
    if (!admin) {
      return AuthService.createErrorResponse("User not found", 404);
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, admin.password);
    if (!isValidPassword) {
      return AuthService.createErrorResponse("Current password is incorrect", 401);
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);
    
    // Update password
    await AdminService.updatePassword(auth.id, hashedNewPassword);
    
    console.log(`[PROFILE UPDATE] Password updated for user: ${auth.username}`);

    return new Response(JSON.stringify({
      success: true,
      message: "Password updated successfully"
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("[PROFILE UPDATE] Error:", error);
    if (error.message === "No authentication token provided" || error.message.includes("Invalid")) {
      return AuthService.createErrorResponse(error.message, 401);
    }
    return AuthService.createErrorResponse("Profile update failed", 500);
  }
} 