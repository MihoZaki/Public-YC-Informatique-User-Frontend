// src/pages/AccountSettings.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom"; // Import Link
import { useAuth } from "../contexts/AuthContext"; // Import useAuth
import { toast } from "sonner"; // Import toast for notifications
import { useForm } from "react-hook-form"; // Import react-hook-form for form handling and validation

const AccountSettings = () => {
  const { user, updateProfile, changePassword } = useAuth(); // Get user and update functions from context
  const [profileSubmitting, setProfileSubmitting] = useState(false); // Loading state for profile form
  const [passwordSubmitting, setPasswordSubmitting] = useState(false); // Loading state for password form

  // Initialize react-hook-form for Profile Form
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors },
    reset: resetProfileForm, // To reset form after successful submission
  } = useForm({
    defaultValues: { // Set default values from the user object
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  // Initialize react-hook-form for Password Form
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
    reset: resetPasswordForm, // To reset form after successful submission
    watch: watchPassword, // To watch password fields for confirmation
  } = useForm();

  // Watch the new password field for confirmation validation
  const newPassword = watchPassword("newPassword", ""); // Default to empty string

  // Handle Profile Form Submission
  const onSubmitProfile = async (data) => {
    setProfileSubmitting(true); // Set loading state
    try {
      // Call the updateProfile function from AuthContext
      await updateProfile(data.name, data.email);
      toast.success("Profile updated successfully!"); // Show success toast
      resetProfileForm(data); // Optionally reset the form to the new values
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(
        error.message || "Failed to update profile. Please try again.",
      ); // Show error toast
    } finally {
      setProfileSubmitting(false); // Reset loading state
    }
  };

  // Handle Password Form Submission
  const onSubmitPassword = async (data) => {
    setPasswordSubmitting(true); // Set loading state
    try {
      // Call the changePassword function from AuthContext
      await changePassword(data.oldPassword, data.newPassword);
      toast.success("Password changed successfully!"); // Show success toast
      resetPasswordForm(); // Reset the password form after successful submission
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error(
        error.message || "Failed to change password. Please try again.",
      ); // Show error toast
    } finally {
      setPasswordSubmitting(false); // Reset loading state
    }
  };

  // Validation rules for react-hook-form
  const profileValidationRules = {
    name: { required: "Name is required" },
    email: {
      required: "Email is required",
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: "Invalid email address",
      },
    },
  };

  const passwordValidationRules = {
    oldPassword: { required: "Current password is required" },
    newPassword: {
      required: "New password is required",
      minLength: {
        value: 8,
        message: "New password must be at least 8 characters long",
      },
      // Add more complex password requirements if needed
    },
    confirmPassword: {
      required: "Please confirm your new password",
      validate: (value) => value === newPassword || "Passwords do not match",
    },
  };

  if (!user) {
    // Optional: Handle case where user is not loaded yet or is null
    return (
      <div className="container mx-auto px-4 py-8 bg-inherit min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-inherit min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

      {/* Back Button */}
      <div className="mb-6">
        <Link to="/account" className="btn btn-sm btn-ghost">
          &larr; Back to Account
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Settings Card */}
        <div className="card bg-base-100 shadow-lg border border-secondary-content">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-6">Profile Information</h2>
            <form onSubmit={handleSubmitProfile(onSubmitProfile)}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="label">
                    <span className="label-text">Full Name</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    className={`input input-bordered w-full ${
                      profileErrors.name ? "input-error" : ""
                    }`}
                    {...registerProfile("name", profileValidationRules.name)}
                  />
                  {profileErrors.name && (
                    <p className="text-error text-sm mt-1">
                      {profileErrors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="label">
                    <span className="label-text">Email Address</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    className={`input input-bordered w-full ${
                      profileErrors.email ? "input-error" : ""
                    }`}
                    {...registerProfile("email", profileValidationRules.email)}
                  />
                  {profileErrors.email && (
                    <p className="text-error text-sm mt-1">
                      {profileErrors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="card-actions justify-end mt-6">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={profileSubmitting} // Disable button while submitting
                >
                  {profileSubmitting
                    ? (
                      <span className="loading loading-spinner loading-xs mr-2">
                      </span>
                    )
                    : null}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Password Change Card */}
        <div className="card bg-base-100 shadow-lg border border-secondary-content">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-6">Change Password</h2>
            <form onSubmit={handleSubmitPassword(onSubmitPassword)}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="oldPassword" className="label">
                    <span className="label-text">Current Password</span>
                  </label>
                  <input
                    id="oldPassword"
                    type="password"
                    className={`input input-bordered w-full ${
                      passwordErrors.oldPassword ? "input-error" : ""
                    }`}
                    {...registerPassword(
                      "oldPassword",
                      passwordValidationRules.oldPassword,
                    )}
                  />
                  {passwordErrors.oldPassword && (
                    <p className="text-error text-sm mt-1">
                      {passwordErrors.oldPassword.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="newPassword" className="label">
                    <span className="label-text">New Password</span>
                  </label>
                  <input
                    id="newPassword"
                    type="password"
                    className={`input input-bordered w-full ${
                      passwordErrors.newPassword ? "input-error" : ""
                    }`}
                    {...registerPassword(
                      "newPassword",
                      passwordValidationRules.newPassword,
                    )}
                  />
                  {passwordErrors.newPassword && (
                    <p className="text-error text-sm mt-1">
                      {passwordErrors.newPassword.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="label">
                    <span className="label-text">Confirm New Password</span>
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    className={`input input-bordered w-full ${
                      passwordErrors.confirmPassword ? "input-error" : ""
                    }`}
                    {...registerPassword(
                      "confirmPassword",
                      passwordValidationRules.confirmPassword,
                    )}
                  />
                  {passwordErrors.confirmPassword && (
                    <p className="text-error text-sm mt-1">
                      {passwordErrors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="card-actions justify-end mt-6">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={passwordSubmitting} // Disable button while submitting
                >
                  {passwordSubmitting
                    ? (
                      <span className="loading loading-spinner loading-xs mr-2">
                      </span>
                    )
                    : null}
                  Change Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
