"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from "chart.js";

// Dynamically import Radar chart to avoid SSR issues
const Radar = dynamic(
  () => import("react-chartjs-2").then((mod) => mod.Radar),
  {
    ssr: false, // Disable server-side rendering
  }
);

// Register chart components
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

// Define the ToolData interface
interface ToolData {
  Tool: string;
  "Liquidity & Cash Flow": number;
  "Debt Management": number;
  "Funding Flexibility": number;
  "Market Insights": number;
  "Innovation & R&D": number;
  Adaptability: number;
  "Networking & Partnerships": number;
  "Reputation & Trust": number;
  "Influence & Engagement": number;
  "Expertise & Skill Levels": number;
  "Experience & Leadership": number;
  "Capacity for Growth & Talent Pipeline": number;
}

// Define fish categories
const fish_categories = {
  Financial: [
    "Liquidity & Cash Flow",
    "Debt Management",
    "Funding Flexibility",
  ],
  Intellectual: ["Market Insights", "Innovation & R&D", "Adaptability"],
  Social: [
    "Networking & Partnerships",
    "Reputation & Trust",
    "Influence & Engagement",
  ],
  Human: [
    "Expertise & Skill Levels",
    "Experience & Leadership",
    "Capacity for Growth & Talent Pipeline",
  ],
};

// Define stronger colors for each category
const categoryColors = {
  Financial: {
    backgroundColor: "rgba(255, 99, 132, 0.4)",
    borderColor: "rgba(255, 99, 132, 1)",
  },
  Intellectual: {
    backgroundColor: "rgba(54, 162, 235, 0.4)",
    borderColor: "rgba(54, 162, 235, 1)",
  },
  Social: {
    backgroundColor: "rgba(255, 206, 86, 0.4)",
    borderColor: "rgba(255, 206, 86, 1)",
  },
  Human: {
    backgroundColor: "rgba(75, 192, 192, 0.4)",
    borderColor: "rgba(75, 192, 192, 1)",
  },
  All: {
    backgroundColor: "rgba(153, 102, 255, 0.4)",
    borderColor: "rgba(153, 102, 255, 1)",
  },
  Total: {
    backgroundColor: "rgba(128, 0, 128, 0.4)",
    borderColor: "rgba(128, 0, 128, 1)",
  },
};

// Define props for the component
interface VisualizationProps {
  data: ToolData;
  maxValue?: number;
  recommend: string;
}

const Visualization: React.FC<VisualizationProps> = ({
  data,
  maxValue = 5,
  recommend,
}) => {
  const [isClient, setIsClient] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [chartInstance, setChartInstance] = useState<any>(null);
  const [windowWidth, setWindowWidth] = useState<number>(0);

  // Initialize window width and add resize listener
  useEffect(() => {
    setIsClient(true);

    // Set initial window width
    setWindowWidth(window.innerWidth);

    // Add window resize listener
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    // Clean up
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (!isClient) return null; // Avoid rendering on the server

  // Determine if mobile based on window width
  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;

  // Calculate the average score for each category
  const calculateCategoryAverage = (category: string): number => {
    const metrics = fish_categories[category as keyof typeof fish_categories];
    if (!metrics || metrics.length === 0) return 0;

    const sum = metrics.reduce(
      (total, metric) =>
        total + ((data[metric as keyof ToolData] as number) || 0),
      0
    );

    return sum / metrics.length;
  };

  // Get all metrics to display
  const getAllMetrics = (): string[] => {
    if (activeCategory === "All") {
      // Return all metrics for all categories
      return Object.values(fish_categories).flat();
    } else if (activeCategory === "Total") {
      // For total, we'll still show all metrics
      return Object.values(fish_categories).flat();
    } else {
      // Return only metrics for the selected category
      return (
        fish_categories[activeCategory as keyof typeof fish_categories] || []
      );
    }
  };

  // Get abbreviated metric names for mobile display
  const getAbbreviatedMetrics = (metrics: string[]): string[] => {
    const abbreviationMap: { [key: string]: string } = {
      "Liquidity & Cash Flow": "Liquidity",
      "Debt Management": "Debt Mgmt",
      "Funding Flexibility": "Funding",
      "Market Insights": "Insights",
      "Innovation & R&D": "Innovation",
      Adaptability: "Adapt",
      "Networking & Partnerships": "Network",
      "Reputation & Trust": "Reputation",
      "Influence & Engagement": "Influence",
      "Expertise & Skill Levels": "Expertise",
      "Experience & Leadership": "Leadership",
      "Capacity for Growth & Talent Pipeline": "Growth Cap",
    };

    return metrics.map((metric) =>
      isMobile ? abbreviationMap[metric] || metric : metric
    );
  };

  // Get dataset for the active category
  const getDataset = () => {
    const metrics = getAllMetrics();

    if (activeCategory === "Total") {
      // Create a single dataset with category averages for each metric
      const totalDataset = {
        label: "Total FISH Capital",
        data: metrics.map((metric) => {
          // Return the original value
          return data[metric as keyof ToolData] as number;
        }),
        backgroundColor: categoryColors.Total.backgroundColor,
        borderColor: categoryColors.Total.borderColor,
        borderWidth: 3,
        pointBackgroundColor: categoryColors.Total.borderColor,
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: categoryColors.Total.borderColor,
        pointRadius: 4,
        fill: true,
      };

      return [totalDataset];
    } else if (activeCategory === "All") {
      // Return one dataset per category when "All" is selected
      return Object.keys(fish_categories).map((category) => {
        const categoryMetrics =
          fish_categories[category as keyof typeof fish_categories];
        const color = categoryColors[category as keyof typeof categoryColors];

        return {
          label: `${category} Capital`,
          data: metrics.map((metric) =>
            categoryMetrics.includes(metric)
              ? (data[metric as keyof ToolData] as number)
              : 0
          ),
          backgroundColor: color.backgroundColor,
          borderColor: color.borderColor,
          borderWidth: 2,
          pointBackgroundColor: color.borderColor,
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: color.borderColor,
          pointRadius: 3,
          fill: true,
        };
      });
    } else {
      // Return just one dataset for the selected category
      const color =
        categoryColors[activeCategory as keyof typeof categoryColors];

      return [
        {
          label: `${activeCategory} Capital`,
          data: metrics.map(
            (metric) => data[metric as keyof ToolData] as number
          ),
          backgroundColor: color.backgroundColor,
          borderColor: color.borderColor,
          borderWidth: 2,
          pointBackgroundColor: color.borderColor,
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: color.borderColor,
          pointRadius: 3,
          fill: true,
        },
      ];
    }
  };

  // The visible metrics
  const metrics = getAllMetrics();
  const displayMetrics = getAbbreviatedMetrics(metrics);

  const radarData: ChartData<"radar"> = {
    labels: displayMetrics,
    datasets: getDataset(),
  };

  // Adjust options based on device size
  const getFontSize = () => {
    if (isMobile) return 8;
    if (isTablet) return 10;
    return 12;
  };

  const getChartHeight = () => {
    if (isMobile) return 350;
    if (isTablet) return 450;
    return 600;
  };

  const options: ChartOptions<"radar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: activeCategory === "All", // Only show legend when "All" is selected
        position: "top",
        labels: {
          font: { size: isMobile ? 10 : 14 },
          usePointStyle: true,
          padding: isMobile ? 10 : 20,
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        titleFont: { size: isMobile ? 12 : 14 },
        bodyFont: { size: isMobile ? 11 : 13 },
        padding: isMobile ? 6 : 10,
        callbacks: {
          title: function (tooltipItems) {
            const index = tooltipItems[0].dataIndex;
            // Return the original metric name, not the abbreviated one
            return metrics[index];
          },
          label: function (context) {
            const label = context.dataset.label || "";
            const value = context.raw as number;
            return `${label}: ${value.toFixed(1)}`;
          },
        },
      },
    },
    scales: {
      r: {
        beginAtZero: true,
        backgroundColor: "rgba(0, 0, 0, 0)",
        angleLines: {
          display: true,
          color: "rgba(0, 0, 0, 0.1)",
        },
        min: 0,
        max: maxValue,
        ticks: {
          stepSize: 1,
          backdropColor: "rgba(255, 255, 255, 0.8)",
          font: { size: getFontSize() },
          display: !isMobile, // Hide tick labels on mobile
        },
        pointLabels: {
          font: {
            size: getFontSize(),
            weight: "bold",
          },
          color: "#333",
          padding: isMobile ? 5 : isTablet ? 10 : 15,
        },
        grid: {
          circular: true,
          color: "rgba(0, 0, 0, 0.1)",
        },
      },
    },
  };

  // Calculate averages for each category and total for stats display
  const categoryAverages = {
    Financial: calculateCategoryAverage("Financial"),
    Intellectual: calculateCategoryAverage("Intellectual"),
    Social: calculateCategoryAverage("Social"),
    Human: calculateCategoryAverage("Human"),
  };

  const totalAverage =
    (categoryAverages.Financial +
      categoryAverages.Intellectual +
      categoryAverages.Social +
      categoryAverages.Human) /
    4;

  // Category selector buttons with stats - adapted for responsive design
  const CategorySelector = () => (
    <div className="mb-4">
      <div
        className={`flex flex-wrap justify-center gap-2 ${
          isMobile ? "gap-1" : "gap-4"
        } mb-4`}
      >
        {["All", "Total", ...Object.keys(fish_categories)].map((category) => {
          const isActive = activeCategory === category;
          const color =
            categoryColors[category as keyof typeof categoryColors] ||
            categoryColors.All;

          return (
            <button
              key={category}
              className={`${
                isMobile
                  ? "px-2 py-1 text-xs"
                  : isTablet
                  ? "px-3 py-1.5 text-sm"
                  : "px-4 py-2 text-base"
              } 
                rounded-full font-medium transition-all ${
                  isActive
                    ? "text-white shadow-md"
                    : "text-gray-700 bg-gray-100 hover:bg-gray-200"
                }`}
              style={{
                backgroundColor: isActive ? color.borderColor : undefined,
              }}
              onClick={() => setActiveCategory(category)}
            >
              {isMobile
                ? category === "All"
                  ? "All"
                  : category === "Total"
                  ? "Total"
                  : category
                : category === "All"
                ? "All Capital"
                : category === "Total"
                ? "Total FISH Capital"
                : `${category} Capital`}
            </button>
          );
        })}
      </div>

      {/* Stats display - only show when Total is selected, responsive grid */}
      {activeCategory === "Total" && (
        <div
          className={`grid ${
            isMobile ? "grid-cols-2" : isTablet ? "grid-cols-3" : "grid-cols-5"
          } gap-2 mb-4 p-2 bg-gray-50 rounded-lg`}
        >
          <div className="text-center p-2 rounded bg-white shadow-sm">
            <div
              className={`${isMobile ? "text-xs" : "text-sm"} text-gray-500`}
            >
              Financial
            </div>
            <div
              className={`font-bold ${isMobile ? "text-base" : "text-lg"}`}
              style={{ color: categoryColors.Financial.borderColor }}
            >
              {categoryAverages.Financial.toFixed(1)}
            </div>
          </div>
          <div className="text-center p-2 rounded bg-white shadow-sm">
            <div
              className={`${isMobile ? "text-xs" : "text-sm"} text-gray-500`}
            >
              Intellectual
            </div>
            <div
              className={`font-bold ${isMobile ? "text-base" : "text-lg"}`}
              style={{ color: categoryColors.Intellectual.borderColor }}
            >
              {categoryAverages.Intellectual.toFixed(1)}
            </div>
          </div>
          <div className="text-center p-2 rounded bg-white shadow-sm">
            <div
              className={`${isMobile ? "text-xs" : "text-sm"} text-gray-500`}
            >
              Social
            </div>
            <div
              className={`font-bold ${isMobile ? "text-base" : "text-lg"}`}
              style={{ color: categoryColors.Social.borderColor }}
            >
              {categoryAverages.Social.toFixed(1)}
            </div>
          </div>
          <div className="text-center p-2 rounded bg-white shadow-sm">
            <div
              className={`${isMobile ? "text-xs" : "text-sm"} text-gray-500`}
            >
              Human
            </div>
            <div
              className={`font-bold ${isMobile ? "text-base" : "text-lg"}`}
              style={{ color: categoryColors.Human.borderColor }}
            >
              {categoryAverages.Human.toFixed(1)}
            </div>
          </div>
          <div
            className={`text-center p-2 rounded bg-white shadow-sm ${
              isMobile ? "col-span-2" : ""
            }`}
          >
            <div
              className={`${isMobile ? "text-xs" : "text-sm"} text-gray-500`}
            >
              Total Average
            </div>
            <div
              className={`font-bold ${isMobile ? "text-base" : "text-lg"}`}
              style={{ color: categoryColors.Total.borderColor }}
            >
              {totalAverage.toFixed(1)}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto px-2 h-[90vh]">
      <CategorySelector />
      <div
        style={{
          height: getChartHeight(),
          width: "100%",
          position: "relative",
        }}
      >
        <Radar
          data={radarData}
          options={options}
          ref={(ref) => {
            if (ref) setChartInstance(ref);
          }}
        />
      </div>
      {/* <div className="text-[2vh]">{recommend}</div> */}
    </div>
  );
};

export default Visualization;
