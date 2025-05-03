'use client'
import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/ui/card"
import { useState } from "react";
import { signUp, login } from "@/app/lib/actions/auth_actions"


export default function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword , setConfirmPassword] = useState("");
  const [register, setRegister] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      if (register) {
        if (password !== confirmPassword) {
          setError("Passwords do not match");
          setLoading(false);
          return;
        }
        
        const result = await signUp(name, email, password);
        console.log("Registration result:", result);
        
        // After successful registration, log in automatically
        const signInResult = await login(email, password);
        
        if (signInResult?.error) {
          console.error("Auto-login after registration failed:", signInResult.error);
          setError("Registration successful, but automatic login failed. Please try logging in manually.");
        } else {
          window.location.href = "/dashboard";
        }
      } else {
        console.log("Logging in with:", email);
        const result = await login(email, password);
        
        if (result?.error) {
          console.error("Login error:", result.error);
          setError("Invalid email or password");
        } else {
          window.location.href = "/dashboard";
        }
      }
    } catch (err: any) {
      console.error("Authentication error:", err);
      setError(err.message || "An error occurred during authentication");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex justify-center items-center bg-base-100 py-20", className)} {...props}>
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-primary">{register ? "Register" : "Login"}</CardTitle>
          <CardDescription className="text-base-content/70">
            Enter your email below to {register ? "register" : "login"} to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              {register && (
                <div className="form-control">
                  <label htmlFor="name" className="label">
                    <span className="label-text">Name</span>
                  </label>
                  <input 
                    type="text" 
                    id="name" 
                    className="input input-bordered w-full" 
                    required 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={loading}
                  />
                </div>
              )}
              <div className="form-control">
                <label htmlFor="email" className="label">
                  <span className="label-text">Email</span>
                </label>
                <input 
                  type="email" 
                  id="email" 
                  placeholder="m@example.com" 
                  className="input input-bordered w-full" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="form-control">
                <label htmlFor="password" className="label">
                  <span className="label-text">Password</span>
                </label>
                <input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input input-bordered"
                  required 
                  disabled={loading}
                />
                {register && (
                  <div>
                    <label htmlFor="confirmPassword" className="label">
                      <span className="label-text">Confirm Password</span>
                    </label>
                    <input 
                      id="confirmPassword" 
                      type="password" 
                      className="input input-bordered w-full" 
                      required 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                )}  
              </div>
              {error && (
                <div className="alert alert-error">
                  <span>{error}</span>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2 mt-6">
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={loading}
              >
                {loading ? (
                  <span className="loading loading-spinner"></span>
                ) : register ? (
                  "Register"
                ) : (
                  "Login"
                )}
              </button>
              {/* <button
                type="button"
                onClick={() => login("github")}
                className="my-2 btn btn-primary w-full"
                disabled={loading}
              >
                Sign in with GitHub
              </button>
              <button
                type="button"
                onClick={() => login("google")}
                className="my-2 btn btn-primary w-full"
                disabled={loading}
              >
                Sign in with Google
              </button> */}
              
              {register ? (
                <div className="mt-6 text-center text-sm text-base-content/70">
                  Already have an account?{" "}
                  <a href="#" onClick={() => setRegister(false)} className="text-primary hover:underline underline-offset-4">
                    Login
                  </a>
                </div>
              ) : (
                <div className="mt-6 text-center text-sm text-base-content/70">
                  Don&apos;t have an account?{" "}
                  <a href="#" onClick={() => setRegister(true)} className="text-primary hover:underline underline-offset-4">
                    Sign up
                  </a>
                </div>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
