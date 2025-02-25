"use server";
import { backendApi } from "@/env.config";
import { z } from "zod";

const ProfessionalSchema = z
  .object({
    name: z.string().min(3).max(50),
    email: z.string().email(),
    phone_number: z.string(),
    password: z.string(),
    password_confirmation: z.string(),
    field: z.string().min(2),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords don't match",
    path: ["password_confirmation"],
  });

export type ProfessionalFormData = z.infer<typeof ProfessionalSchema>;

export async function registerProfessional(
  formData: FormData
): Promise<{ message?: string; error?: string | null; success: boolean }> {
  console.log("SERVER ACTIO HIT:::::: before try");

  try {
    // const validatedData = ProfessionalSchema.parse(formData);

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone_number = formData.get("phone_number") as string;
    const password = formData.get("password") as string;
    const password_confirmation = formData.get(
      "password_confirmation"
    ) as string;
    const field = formData.get("field") as string;

    console.log("VALIDATED DATA", {
      name,
      email,
      phone_number,
      password,
      password_confirmation,
      field,
    });

    const extractedData = {
      name,
      email,
      phone_number,
      password,
      password_confirmation,
      field,
    };

    const validatedData = ProfessionalSchema.parse(extractedData);
    console.log("API SHITT", backendApi.endpoint);
    const response = await fetch(
      `${backendApi.endpoint}/api/professional/register"`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(validatedData),
      }
    );

    // console.log("REESP", response);
    console.log("REALLLLLLLLLL", await response.json());

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const err = error as unknown as z.ZodError;
      return { success: false, error: err.errors[0].message };
    }
    console.log("SERVER ACTION", error);
    return { success: false, error: "Failed to register professional" };
  }
}
