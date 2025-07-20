import { AuthService } from "../../auth.js";

/**
 * Admin Logout Endpoint
 * POST /api/admin/logout
 */
export async function POST(request) {
  try {
    // Try to get current user info for logging
    let username = "unknown";
    try {
      const auth = await AuthService.authenticate(request);
      username = auth.username;
    } catch (error) {
      // Ignore auth errors for logout - we'll clear the cookie anyway
    }
    
    // Always return success and clear cookie
    return AuthService.createLogoutResponse();
    
  } catch (error) {
    console.error("[LOGOUT] Error during logout:", error);
    // Even if there's an error, clear the cookie
    return AuthService.createLogoutResponse();
  }
} 