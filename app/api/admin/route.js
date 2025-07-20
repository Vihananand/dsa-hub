import bcrypt from "bcrypt";
import { AuthService, AdminService } from "../auth.js";

/**
 * Admin Login Endpoint
 * POST /api/admin
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // Validate input
    if (!username || !password) {
      return AuthService.createErrorResponse("Username and password are required", 400);
    }

    if (typeof username !== "string" || typeof password !== "string") {
      return AuthService.createErrorResponse("Invalid credential format", 400);
    }

    if (username.length > 50 || password.length > 100) {
      return AuthService.createErrorResponse("Credentials too long", 400);
    }

    // Find admin user
    const admin = await AdminService.findByUsername(username);
    if (!admin) {
      // Use same response time to prevent username enumeration
      await bcrypt.compare(password, "$2b$10$dummy.hash.to.prevent.timing.attacks");
      return AuthService.createErrorResponse("Invalid credentials", 401);
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      return AuthService.createErrorResponse("Invalid credentials", 401);
    }

    // Generate JWT token
    const tokenPayload = {
      id: admin.id,
      username: admin.username,
      type: "admin"
    };

    const token = AuthService.generateToken(tokenPayload, "24h");

    // Return success response with cookie
    return AuthService.createAuthResponse({
      success: true,
      message: "Login successful",
      user: {
        id: admin.id,
        username: admin.username,
        created_at: admin.created_at
      }
    }, token);

  } catch (error) {
    console.error("[LOGIN] Error during login:", error);
    
    // Don't expose internal errors to client
    if (error.message.includes("connect") || error.message.includes("database")) {
      return AuthService.createErrorResponse("Service temporarily unavailable", 503);
    }
    
    return AuthService.createErrorResponse("Authentication failed", 500);
  }
} 