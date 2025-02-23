
"use server";

import { ENDPOINTS } from "@/constants/consts";

export const getAllProfessionals = async () => {

  const response = await fetch(ENDPOINTS.GET_ALL_PROFESSIONALS);

  const result = await response.json();
  console.log("RESULT", result);

  if (!response.ok) {
    const errorData = await response.json(); // Parse error message
    throw new Error(errorData.message || "HTTP Error: ${response.status}");
  }
  
  return result;
};
