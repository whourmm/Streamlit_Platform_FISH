"use client";

import Visualization from "@/components/visualization";

export default function BusinessAssessmentPage() {
  const data = {
    Tool: "Business A",
    "Liquidity & Cash Flow": 3,
    "Debt Management": 4,
    "Funding Flexibility": 5,
    "Market Insights": 4,
    "Innovation & R&D": 3,
    Adaptability: 2,
    "Networking & Partnerships": 1,
    "Reputation & Trust": 5,
    "Influence & Engagement": 3,
    "Expertise & Skill Levels": 4,
    "Experience & Leadership": 4,
    "Capacity for Growth & Talent Pipeline": 3,
  };

  // Optional: Custom color groups
  const colorGroups = [
    {
      backgroundColor: "rgba(255, 99, 132, 0.2)",
      borderColor: "rgba(255, 99, 132, 1)",
    }, // Red for Financial
    {
      backgroundColor: "rgba(54, 162, 235, 0.2)",
      borderColor: "rgba(54, 162, 235, 1)",
    }, // Blue for Market
    {
      backgroundColor: "rgba(255, 206, 86, 0.2)",
      borderColor: "rgba(255, 206, 86, 1)",
    }, // Yellow for Relational
    {
      backgroundColor: "rgba(75, 192, 192, 0.2)",
      borderColor: "rgba(75, 192, 192, 1)",
    }, // Teal for Human Capital
  ];

  const recommend = "The is recommended data. Coming Soom...";

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Business Assessment</h1>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <Visualization data={data} maxValue={5} recommend={recommend} />
      </div>
    </div>
  );
}
