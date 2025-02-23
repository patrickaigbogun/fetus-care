"use client";

import { useState } from "react";
import { appointments } from "@/_mock/appointments";
import { Search, Calendar, Edit } from "lucide-react";

export default function WorkSchedule() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [selectedProfessional, setSelectedProfessional] = useState<
    string | null
  >(null);

  // Flatten the appointments data for easier filtering
  const allProfessionals = Array.from(
    new Set(appointments.map((a) => a.specialist))
  );

  const filteredProfessionals = allProfessionals.filter((professional) =>
    professional.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const appointmentTypes = selectedProfessional
    ? appointments.find((a) => a.specialist === selectedProfessional)
        ?.appointments || []
    : [];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Search Professionals */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Select Professional
        </h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search professionals..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredProfessionals.map((professional) => (
            <button
              key={professional}
              onClick={() => setSelectedProfessional(professional)}
              className={`p-4 rounded-lg border transition-all ${
                selectedProfessional === professional
                  ? "border-blue-500 bg-blue-50"
                  : "hover:bg-gray-50"
              }`}
            >
              <h3 className="font-medium text-gray-800">{professional}</h3>
            </button>
          ))}
        </div>
      </div>

      {/* Date Picker */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Select Date</h2>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="date"
            value={selectedDate?.toISOString().split("T")[0] || ""}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Appointment Type */}
      {selectedProfessional && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Select Appointment Type
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {appointmentTypes.map((type) => (
              <button
                key={type.type}
                onClick={() => setSelectedType(type.type)}
                className={`p-4 rounded-lg border transition-all ${
                  selectedType === type.type
                    ? "border-blue-500 bg-blue-50"
                    : "hover:bg-gray-50"
                }`}
              >
                <h3 className="font-medium text-gray-800">{type.type}</h3>
                <p className="text-sm text-gray-600 mt-1">{type.description}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Add Notes</h2>
        <div className="relative">
          <Edit className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any additional notes..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 min-h-[120px]"
          />
        </div>
      </div>
    </div>
  );
}
