"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";
import { useMutation } from "@tanstack/react-query";
import { IconLoader } from "@tabler/icons-react";
import { ENDPOINTS } from "@/constants/consts";
import Cookies from "js-cookie";
import { toast } from "sonner";

interface RegistrationResponse {
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
  email: string;
  password: string;
  password_confirmation: string;
  isProfessional: boolean;
  phone_number: string;
  field:
    | "Obstetrics"
    | "Gynecology"
    | "Perinatology"
    | "Midwifery"
    | "Endocrinology"
    | "Other";
  grade: 1 | 2 | 3 | 4 | 5;
}

export default function PatientRegister() {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
    password_confirmation: "",
    isProfessional: false,
    phone_number: "",
    field: "Obstetrics",
    grade: 1,
  });
  const router = useRouter();

  const registrationMutation = useMutation<
    RegistrationResponse,
    Error,
    FormData
  >({
    mutationFn: async (data: FormData) => {
      try {
        const response = await fetch(
          formData.isProfessional
            ? ENDPOINTS.PROF_REGISTER
            : ENDPOINTS.PATIENT_REGISTER,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...data,
              [formData.isProfessional ? "name" : "username"]:
                formData.username,
            }),
          }
        );

        // Log the response details
        response.clone();

        // Parse response
        const jsonData = await response.json();

        if (jsonData.errors) {
          Object.values(jsonData.errors).forEach((errorArray: any) => {
            errorArray.forEach((errorMessage: any) => {
              toast.error(errorMessage);
            });
          });

          return;
        }
        Cookies.set("token", jsonData.token);
        Cookies.set("user", JSON.stringify(jsonData.user));

        return jsonData;
      } catch (error) {
        console.error("Detailed error:", error);
        toast.error("Something went wrong, please try again.");
      }
    },
    onSuccess: (data) => {
      if (data && data.token) {
        setFormData({
          username: "",
          email: "",
          password: "",
          password_confirmation: "",
          isProfessional: false,
          phone_number: "",
          field: "Obstetrics",
          grade: 1,
        });

        router.push("/dashboard");
      }
    },
    onError: (error: any) => {
      console.error("Error:", error);
      toast.error(error.message || "An error occurred, please try again.");
    },
  });
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registrationMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            User Registration
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Create a new account
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
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
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
            <div>
              <input
                type="password"
                name="password_confirmation"
                placeholder="Confirm Password"
                value={formData.password_confirmation}
                onChange={handleChange}
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="isProfessional"
                className="flex items-center space-x-2"
              >
                <input
                  type="checkbox"
                  id="isProfessional"
                  name="isProfessional"
                  checked={formData.isProfessional}
                  onChange={handleChange}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <span className="text-gray-700">Are you a Professional?</span>
              </label>
            </div>

            {formData.isProfessional && (
              <>
                <div>
                  <input
                    type="tel"
                    name="phone_number"
                    placeholder="Phone Number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    required
                    className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                  />
                </div>

                <div>
                  <select
                    name="field"
                    value={formData.field}
                    onChange={handleChange}
                    className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                  >
                    <option value="Obstetrics">Obstetrics</option>
                    <option value="Gynecology">Gynecology</option>
                    <option value="Perinatology">Perinatology</option>
                    <option value="Midwifery">Midwifery</option>
                    <option value="Endocrinology">Endocrinology</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <select
                    name="grade"
                    value={formData.grade}
                    onChange={handleChange}
                    className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                </div>
              </>
            )}
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200"
              disabled={registrationMutation.isPending}
            >
              {registrationMutation.isPending ? (
                <IconLoader size={24} className="animate-spin" />
              ) : (
                "Register"
              )}
            </button>
          </div>
        </form>

        <div>
          <Link href={"/login"}>
            <button className="w-full text-center ">Login</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
