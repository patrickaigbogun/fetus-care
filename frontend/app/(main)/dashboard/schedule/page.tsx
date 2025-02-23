// get professors and display to be selected by users
// date of appointment
// type of appointment: consultation, exam, counceling
// notes




"use client";

import { useState } from "react";
import { Copy, Trash, X } from "lucide-react";

export default function WorkSchedule() {
  const [selectedDays, setSelectedDays] = useState<string[]>([
    "Mo",
    "Tu",
    "We",
    "Th",
    "Fr",
  ]);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("18:00");
  const [breakType, setBreakType] = useState<"Fixed" | "Flexible">("Flexible");
  const [breakDuration, setBreakDuration] = useState("01:00");
  const [isDefineBreaks, setIsDefineBreaks] = useState(true);

  const days = [
    { short: "Mo", long: "Monday" },
    { short: "Tu", long: "Tuesday" },
    { short: "We", long: "Wednesday" },
    { short: "Th", long: "Thursday" },
    { short: "Fr", long: "Friday" },
    { short: "Sa", long: "Saturday" },
    { short: "Su", long: "Sunday" },
  ];

  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const calculateTotalHours = () => {
    const start = startTime.split(":").map(Number);
    const end = endTime.split(":").map(Number);
    const break_ = breakDuration.split(":").map(Number);

    const totalMinutes =
      end[0] * 60 +
      end[1] -
      (start[0] * 60 + start[1]) -
      (break_[0] * 60 + break_[1]);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Working days
          </h2>
          <p className="text-gray-600 mb-4">
            Select the working days of the week in this work schedule.
          </p>
          <div className="flex gap-2">
            {days.map((day) => (
              <button
                key={day.short}
                onClick={() => toggleDay(day.short)}
                className={`w-12 h-12 rounded-lg font-medium transition-colors
                  ${
                    selectedDays.includes(day.short)
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-600 border"
                  }`}
              >
                {day.short}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">Monday</h3>
            <button className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700">
              <Copy className="w-4 h-4" />
              <span>Copy to all</span>
            </button>
          </div>

          <div>
            <h4 className="text-gray-700 mb-2">Working hours</h4>
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-32 px-3 py-2 border rounded-lg pr-8"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <span className="text-gray-600">to</span>
              <div className="relative">
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-32 px-3 py-2 border rounded-lg pr-8"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <Trash className="w-4 h-4" />
              </button>
            </div>
          </div>

          <button className="text-emerald-600 hover:text-emerald-700 font-medium">
            + Add new
          </button>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer
                  ${isDefineBreaks ? "bg-emerald-500" : "bg-gray-200"}`}
                onClick={() => setIsDefineBreaks(!isDefineBreaks)}
              >
                <div
                  className={`absolute w-5 h-5 rounded-full bg-white top-0.5 transition-all
                    ${isDefineBreaks ? "left-[22px]" : "left-0.5"}`}
                />
              </div>
              <span className="font-medium text-gray-700">
                Define work breaks
              </span>
            </div>

            {isDefineBreaks && (
              <div className="space-y-4">
                <div>
                  <p className="text-gray-700 mb-2">Work breaks are</p>
                  <div className="inline-flex rounded-lg border p-1">
                    {["Fixed", "Flexible"].map((type) => (
                      <button
                        key={type}
                        onClick={() =>
                          setBreakType(type as "Fixed" | "Flexible")
                        }
                        className={`px-4 py-1 rounded-md transition-colors
                          ${
                            breakType === type
                              ? "bg-emerald-100 text-emerald-600"
                              : "text-gray-600"
                          }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-gray-700 mb-2">Break duration</p>
                  <div className="relative">
                    <input
                      type="time"
                      value={breakDuration}
                      onChange={(e) => setBreakDuration(e.target.value)}
                      className="w-32 px-3 py-2 border rounded-lg pr-8"
                    />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t">
            <p className="text-gray-600">
              Total working hours:{" "}
              <span className="font-medium">{calculateTotalHours()}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

