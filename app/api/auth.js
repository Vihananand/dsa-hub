import jwt from "jsonwebtoken";
import pool from "./db.js";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}

/**
 * Authentication middleware for API routes
 */
export class AuthService {
  /**
   * Generate JWT token
   */
  static generateToken(payload, expiresIn = "24h") {
    return jwt.sign(payload, JWT_SECRET, { expiresIn });
  }

  /**
   * Verify JWT token
   */
  static verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      throw new Error("Invalid or expired token");
    }
  }

  /**
   * Extract token from request
   */
  static extractToken(request) {
    // Try to get token from cookies first
    const cookieToken = request.cookies?.get("token")?.value;
    if (cookieToken) return cookieToken;

    // Fallback to Authorization header
    const authHeader = request.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      return authHeader.substring(7);
    }

    return null;
  }

  /**
   * Authenticate request and return user data
   */
  static async authenticate(request) {
    const token = this.extractToken(request);
    
    if (!token) {
      throw new Error("No authentication token provided");
    }

    const decoded = this.verifyToken(token);
    
    // Verify user still exists in database
    const { rows } = await pool.query(
      "SELECT id, username, created_at FROM admin WHERE id = $1",
      [decoded.id]
    );

    if (!rows.length) {
      throw new Error("User no longer exists");
    }

    return {
      id: decoded.id,
      username: decoded.username,
      user: rows[0]
    };
  }

  /**
   * Create authentication response with cookie
   */
  static createAuthResponse(data, token) {
    const isProduction = process.env.NODE_ENV === "production";
    
    const response = new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Set secure cookie
    const cookieValue = `token=${token}; HttpOnly; Path=/; Max-Age=${24 * 60 * 60}; SameSite=Strict${
      isProduction ? "; Secure" : ""
    }`;
    
    response.headers.set("Set-Cookie", cookieValue);
    return response;
  }

  /**
   * Create logout response (clear cookie)
   */
  static createLogoutResponse() {
    const isProduction = process.env.NODE_ENV === "production";
    
    const response = new Response(JSON.stringify({ success: true, message: "Logged out successfully" }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });

    const cookieValue = `token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict${
      isProduction ? "; Secure" : ""
    }`;
    
    response.headers.set("Set-Cookie", cookieValue);
    return response;
  }

  /**
   * Create error response
   */
  static createErrorResponse(message, status = 401) {
    return new Response(JSON.stringify({ error: message, authenticated: false }), {
      status,
      headers: { "Content-Type": "application/json" },
    });
  }
}

/**
 * Higher-order function to protect API routes
 */
export function withAuth(handler) {
  return async function(request, context) {
    try {
      const auth = await AuthService.authenticate(request);
      // Add auth data to request context
      return await handler(request, { ...context, auth });
    } catch (error) {
      console.error("[AUTH ERROR]", error.message);
      return AuthService.createErrorResponse(error.message);
    }
  };
}

/**
 * Admin service for database operations
 */
export class AdminService {
  /**
   * Find admin by username
   */
  static async findByUsername(username) {
    const { rows } = await pool.query(
      "SELECT * FROM admin WHERE username = $1",
      [username]
    );
    return rows[0] || null;
  }

  /**
   * Create new admin user
   */
  static async create(username, hashedPassword) {
    const { rows } = await pool.query(
      "INSERT INTO admin (username, password) VALUES ($1, $2) RETURNING id, username, created_at",
      [username, hashedPassword]
    );
    return rows[0];
  }

  /**
   * Update admin password
   */
  static async updatePassword(id, hashedPassword) {
    const { rows } = await pool.query(
      "UPDATE admin SET password = $1 WHERE id = $2 RETURNING id, username",
      [hashedPassword, id]
    );
    return rows[0];
  }

  /**
   * Get admin profile
   */
  static async getProfile(id) {
    const { rows } = await pool.query(
      "SELECT id, username, created_at FROM admin WHERE id = $1",
      [id]
    );
    return rows[0] || null;
  }

  /**
   * Delete admin user
   */
  static async delete(id) {
    const { rows } = await pool.query(
      "DELETE FROM admin WHERE id = $1 RETURNING id, username",
      [id]
    );
    return rows[0];
  }
}
