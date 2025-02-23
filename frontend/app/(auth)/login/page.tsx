"use client";
import { ENDPOINTS } from "@/constants/consts";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { IconLoader } from "@tabler/icons-react";
import { setCookie } from "cookies-next";
import { toast } from "sonner";

interface LoginResponse {
  status: boolean;
  message: string;
  token: string;
  user: {
    username: string;
    email: string;
    updated_at: string;
    created_at: string;
    id: number;
  };
}

interface FormData {
  username: string;
  password: string;
}

export default function PatientLogin() {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
  });
  const router = useRouter();

  const loginMutation = useMutation<LoginResponse, Error, FormData>({
    mutationFn: async (data: FormData) => {
      try {
        const response = await fetch(ENDPOINTS.PATIENT_LOGIN, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        // Parse response
        const jsonData = await response.json();

        if (!response.ok) {
          // Check for Laravel validation errors
          if (jsonData.errors) {
            Object.values(jsonData.errors).forEach((errorArray: any) => {
              errorArray.forEach((errorMessage: any) => {
                toast.error(errorMessage);
              });
            });
            throw new Error("Login failed due to validation errors.");
          } else {
            // If no specific errors, throw a general error message
            throw new Error(jsonData.message || "Login failed!");
          }
        }

        return jsonData;
      } catch (error: any) {
        console.error("Login error:", error.message);
        toast.error(error.message || "An error occurred during login.");
        throw error; // Re-throw to let useMutation handle the error
      }
    },
    onSuccess: (data) => {
      if (data && data.token) {
        setCookie("token", data.token, {
          httpOnly: true,
          maxAge: 60 * 60 * 24 * 7,
        }); // 7 days
        setCookie("user", data.user, {
          httpOnly: true,
          maxAge: 60 * 60 * 24 * 7,
        }); // 7 days

        setFormData({
          username: "",
          password: "",
        });

        router.push("/dashboard");
        toast.success("Login successful!");
      }
    },
    onError: (error: any) => {
      console.error("Login error:", error.message);
      toast.error(error.message || "Login failed!");
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Patient Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to your account
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
              />
            </div>
            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <IconLoader size={24} className="animate-spin" />
              ) : (
                "Login"
              )}
            </button>
          </div>
        </form>

        <div>
          <Link href={"/register"}>
            <button className="w-full text-center ">Create Account</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
