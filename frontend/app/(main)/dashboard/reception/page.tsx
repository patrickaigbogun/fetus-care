"use client";

import { useState } from "react";
import ProfileCard from "@/components/ui/profilecard";
import { PaperPlaneRight } from "@phosphor-icons/react";
import { Button, Container, Section, TextArea } from "@radix-ui/themes";

// Define the professional type
interface Professional {
  id: number;
  professional_id: string;
  name: string;
  field: string;
  phone_number: string;
  grade: number;
  email: string;
}

function ReceptionPage() {
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [profiles, setProfiles] = useState<Professional[]>([]); // Add type annotation

  // Handle sending symptoms to the API
  const handleSendMessage = async () => {
    if (!input.trim()) return;

    setIsStreaming(true);

    try {
      const response = await fetch("/api/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ symptoms: input }),
      });

      const data = await response.json();

      if (response.ok) {
        setProfiles(data.recommended_professionals || []);
      } else {
        console.error("API Error:", data.error);
      }
    } catch (error) {
      console.error("Request failed:", error);
    } finally {
      setIsStreaming(false);
      setInput("");
    }
  };

  return (
    <Container>
      {/* Input Section */}
      <div className="flex items-center gap-2 mb-4">
        <TextArea
          variant="soft"
          placeholder="Describe your symptoms..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 text-black"
          disabled={isStreaming}
        />
        <Button
          variant="soft"
          onClick={handleSendMessage}
          disabled={isStreaming || !input.trim()}
        >
          <PaperPlaneRight weight="duotone" size={24} />
        </Button>
      </div>

      {/* Professional Recommendations */}
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {profiles.length > 0 ? (
          profiles.map((profile) => (
            <Section key={profile.id}>
              <ProfileCard
                name={profile.name}
                job={profile.field}
                email={profile.email}
                phone={profile.phone_number}
              />
            </Section>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            No professionals recommended yet.
          </p>
        )}
      </div>
    </Container>
  );
}

export default ReceptionPage;
