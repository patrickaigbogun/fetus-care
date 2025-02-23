import { ENDPOINTS } from "@/constants/consts";
import { NextResponse } from "next/server";

const OLLAMA_API_URL = "http://localhost:11434/api/generate";

// Function to map severity score (1-10) to professional grade
const mapSeverityToGrade = (score: number) => {
    if (score <= 2) return 1;  // Very Mild
    if (score <= 4) return 2;  // Mild
    if (score <= 6) return 3;  // Moderate
    if (score <= 8) return 4;  // Severe
    return 5;  // Critical
};

export async function POST(req: Request) {
    try {
        const { symptoms } = await req.json();
        if (!symptoms) {
            return NextResponse.json({ error: "Symptoms are required" }, { status: 400 });
        }

        // Ask Meditron for a severity score (1-10)
        const prompt = `On a scale of 1 to 10, how severe are the following symptoms? Return only a number. Symptoms: ${symptoms}`;
        
        const response = await fetch(OLLAMA_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ model: "meditron", prompt }),
        });

        const data = await response.json();
        const score = parseInt(data?.response?.trim(), 10);

        // Validate score and map to professional grade
        if (isNaN(score) || score < 1 || score > 10) {
            return NextResponse.json({ error: "Invalid severity score from AI" }, { status: 500 });
        }

        const grade = mapSeverityToGrade(score);

        // Fetch professionals that match the severity grade
        const professionals = await fetch(ENDPOINTS.GET_ALL_PROFESSIONALS,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ model: "meditron", prompt }),
            }
        );

        return NextResponse.json({
            severity_score: score,
            mapped_grade: grade,
            recommended_professionals: professionals,
        });

    } catch (error) {
        return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
    }
}