import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import heroBackgroundImage from "../assets/heroBackgroundImage.png";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and signup
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  }); // Include name for signup
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login, register, user } = useAuth(); // Get register function as well
  const navigate = useNavigate();

  // Redirect if already logged in
  if (user) {
    navigate("/"); // Or wherever you want to go after login
    return null; // Don't render anything while navigating
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setIsLoading(true);

    try {
      // Simple validation (add more as needed)
      if (!formData.email || !formData.password) {
        setError("Email and password are required.");
        setIsLoading(false);
        return;
      }

      if (!isLogin && !formData.name.trim()) {
        setError("Name is required for signup.");
        setIsLoading(false);
        return;
      }

      if (isLogin) {
        // Login attempt
        await login({
          email: formData.email,
          password: formData.password,
        });
        toast.success("Logged in successfully!");
      } else {
        // Registration attempt
        await register({
          email: formData.email,
          password: formData.password,
          full_name: formData.name.trim(),
        });
        toast.success("Account created successfully!");
      }

      // Navigate to appropriate page after successful auth
      navigate("/account");
    } catch (error) {
      console.error(isLogin ? "Login" : "Registration", "error:", error);

      // Try to get error message from response
      let errorMessage = isLogin
        ? "Login failed. Please try again."
        : "Registration failed. Please try again.";

      if (error.response) {
        // Server responded with error status
        if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.status === 401) {
          errorMessage = "Invalid email or password.";
        } else if (error.response.status === 409) {
          errorMessage = "Email already exists. Please use a different email.";
        }
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = "Network error. Please check your connection.";
      }

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="relative w-full px-4 py-8 min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: `url(${heroBackgroundImage})`, // Use the imported variable
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute w-full min-h-screen bg-base-300/50" />
      <div className="card bg-base-100 w-full max-w-md shadow-xl border border-base-200">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4">
            {isLogin ? "Login" : "Sign Up"}
          </h2>

          {error && <div className="alert alert-error mb-4">{error}</div>}

          <form onSubmit={handleSubmit}>
            {!isLogin && ( // Show name field only for signup
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Full Name</span>
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  className="input input-bordered"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
            )}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="email@example.com"
                className="input input-bordered"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            <div className="form-control mt-2">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                className="input input-bordered"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            <div className="form-control mt-6">
              <button
                type="submit"
                className={`btn btn-primary ${isLoading ? "loading" : ""}`}
                disabled={isLoading}
              >
                {isLoading
                  ? (
                    <>
                      <span className="loading loading-spinner loading-xs mr-2">
                      </span>
                      {isLogin ? "Logging in..." : "Signing up..."}
                    </>
                  )
                  : (
                    isLogin ? "Log In" : "Sign Up"
                  )}
              </button>
            </div>
          </form>

          <div className="divider my-4">OR</div>

          <div className="text-center">
            <p className="text-sm">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              {" "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="link link-primary"
                disabled={isLoading}
              >
                {isLogin ? "Sign Up" : "Log In"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
