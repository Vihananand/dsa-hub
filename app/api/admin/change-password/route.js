import bcrypt from "bcrypt";
import { AuthService, AdminService } from "../../auth.js";

export async function POST(request) {
  try {
    // Authenticate the request
    const auth = await AuthService.authenticate(request);
    
    const body = await request.json();
    const { currentPassword, newPassword } = body;
    
    if (!currentPassword || !newPassword) {
      return AuthService.createErrorResponse("Current password and new password are required", 400);
    }

    if (newPassword.length < 6) {
      return AuthService.createErrorResponse("New password must be at least 6 characters long", 400);
    }

    // Get current admin user data
    const admin = await AdminService.findByUsername(auth.username);
    if (!admin) {
      return AuthService.createErrorResponse("User not found", 404);
    }
    
    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, admin.password);
    if (!isCurrentPasswordValid) {
      return AuthService.createErrorResponse("Current password is incorrect", 400);
    }
    
    // Hash new password
    const saltRounds = 12;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);
    
    // Update password in database
    const updatedAdmin = await AdminService.updatePassword(admin.id, newPasswordHash);
    
    if (!updatedAdmin) {
      return AuthService.createErrorResponse("Failed to update password", 500);
    }
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: "Password changed successfully"
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
    
  } catch (error) {
    console.error("[CHANGE PASSWORD API] Error:", error);
    
    if (error.message.includes("No authentication token") || error.message.includes("Invalid or expired")) {
      return AuthService.createErrorResponse("Unauthorized", 401);
    }
    
    return AuthService.createErrorResponse("Failed to change password", 500);
  }
}
