import bcrypt from "bcrypt";
import { AuthService, AdminService } from "../../auth.js";

export async function POST(request) {
  console.log("[CHANGE PASSWORD API] POST request received");
  
  try {
    // Authenticate the request
    const auth = await AuthService.authenticate(request);
    console.log("[CHANGE PASSWORD API] Authentication successful for user:", auth.username);
    
    const body = await request.json();
    const { currentPassword, newPassword } = body;
    
    if (!currentPassword || !newPassword) {
      console.log("[CHANGE PASSWORD API] Missing required fields");
      return AuthService.createErrorResponse("Current password and new password are required", 400);
    }

    if (newPassword.length < 6) {
      console.log("[CHANGE PASSWORD API] New password too short");
      return AuthService.createErrorResponse("New password must be at least 6 characters long", 400);
    }

    // Get current admin user data
    const admin = await AdminService.findByUsername(auth.username);
    if (!admin) {
      console.log("[CHANGE PASSWORD API] Admin user not found");
      return AuthService.createErrorResponse("User not found", 404);
    }
    
    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, admin.password);
    if (!isCurrentPasswordValid) {
      console.log("[CHANGE PASSWORD API] Current password is invalid");
      return AuthService.createErrorResponse("Current password is incorrect", 400);
    }
    
    // Hash new password
    const saltRounds = 12;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);
    
    // Update password in database
    const updatedAdmin = await AdminService.updatePassword(admin.id, newPasswordHash);
    
    if (!updatedAdmin) {
      console.log("[CHANGE PASSWORD API] Failed to update password");
      return AuthService.createErrorResponse("Failed to update password", 500);
    }
    
    console.log("[CHANGE PASSWORD API] Password updated successfully for user:", auth.username);
    
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
