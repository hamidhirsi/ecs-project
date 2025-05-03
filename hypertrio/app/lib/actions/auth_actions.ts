'use server'

import { signIn } from "@/auth";

export const login = async (email: string, password?: string) => {
  try {
    if (typeof email === 'string' && !password) {
      // This is a provider login (github, google)
      return await signIn(email, { callbackUrl: "/dashboard" });
    }
    
    // This is a credentials login
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false
    });
    
    return result;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const signUp = async(name: string, email: string, password: string) => {
  try {
    // Register the user with the FastAPI backend
    const res = await fetch("http://localhost:8000/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ detail: "Registration failed" }));
      throw new Error(errorData.detail || "Registration failed");
    }
    
    // Get the user data from the response
    const userData = await res.json();
    console.log("Registration successful:", userData);
    
    // Return success
    return { success: true, user: userData };
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};