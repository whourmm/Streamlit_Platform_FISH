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
} from "chart.js";

// Dynamically import Radar chart to avoid SSR issues
const Radar = dynamic(
  () => import("react-chartjs-2").then((mod) => mod.Radar),
  { ssr: false }
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

// Define category colors
const categoryColors = {
  Financial: {
    backgroundColor: "rgba(255, 99, 132, 0.3)",
    borderColor: "rgba(255, 99, 132, 1)",
  },
  Intellectual: {
    backgroundColor: "rgba(54, 162, 235, 0.3)",
    borderColor: "rgba(54, 162, 235, 1)",
  },
  Social: {
    backgroundColor: "rgba(255, 206, 86, 0.3)",
    borderColor: "rgba(255, 206, 86, 1)",
  },
  Human: {
    backgroundColor: "rgba(75, 192, 192, 0.3)",
    borderColor: "rgba(75, 192, 192, 1)",
  },
};

// Define props for the component
interface VisualizationProps {
  data: ToolData;
  maxValue?: number;
  recommend: string;
}

const CircularRadarVisualization: React.FC<VisualizationProps> = ({
  data,
  maxValue = 5,
  recommend,
}) => {
  const [isClient, setIsClient] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    Object.keys(fish_categories)
  );
  const [windowWidth, setWindowWidth] = useState<number>(0);

  // Initialize window width and add resize listener
  useEffect(() => {
    setIsClient(true);
    setWindowWidth(window.innerWidth);

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (!isClient) return null;

  // Determine if mobile based on window width
  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;

  // Calculate averages for stats display
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

  // Get all metrics across all categories
  const getAllMetrics = () => {
    const allMetrics: string[] = [];

    // If all categories are selected or we're showing all categories
    if (showAllCategories) {
      Object.values(fish_categories).forEach((metrics) => {
        metrics.forEach((metric) => {
          allMetrics.push(metric);
        });
      });
    } else {
      // Only get metrics for selected categories
      selectedCategories.forEach((category) => {
        const metrics =
          fish_categories[category as keyof typeof fish_categories];
        metrics.forEach((metric) => {
          allMetrics.push(metric);
        });
      });
    }

    return allMetrics;
  };

  // Abbreviate metric names for mobile display
  const getAbbreviatedMetric = (metric: string): string => {
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

    return isMobile ? abbreviationMap[metric] || metric : metric;
  };

  // Create a single dataset with all metrics
  const getCombinedDataset = () => {
    const allMetrics = getAllMetrics();
    const dataPoints = allMetrics.map(
      (metric) => data[metric as keyof ToolData] as number
    );

    return {
      label: "All Categories",
      data: dataPoints,
      backgroundColor: "rgba(153, 102, 255, 0.3)",
      borderColor: "rgba(153, 102, 255, 1)",
      borderWidth: 2,
      fill: true,
    };
  };

  // Create datasets for category comparison
  const getCategoryDatasets = () => {
    const allMetrics = getAllMetrics();

    return selectedCategories.map((category) => {
      const categoryMetrics =
        fish_categories[category as keyof typeof fish_categories];
      const color = categoryColors[category as keyof typeof categoryColors];

      // For each metric in allMetrics, if it's in this category, use the value, otherwise use 0
      const categoryData = allMetrics.map((metric) => {
        if (categoryMetrics.includes(metric)) {
          return data[metric as keyof ToolData] as number;
        }
        return 0; // Use 0 instead of null which was causing issues
      });

      return {
        label: category,
        data: categoryData,
        backgroundColor: color.backgroundColor,
        borderColor: color.borderColor,
        borderWidth: 2,
        fill: true,
      };
    });
  };

  // Get appropriate datasets based on view mode
  const getDatasets = () => {
    if (showAllCategories) {
      return [getCombinedDataset()];
    } else {
      return getCategoryDatasets();
    }
  };

  // Prepare chart data
  const chartData = {
    labels: getAllMetrics().map(getAbbreviatedMetric),
    datasets: getDatasets(),
  };

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        min: 0,
        max: maxValue,
        ticks: {
          stepSize: 1,
          display: true,
          backdropColor: "rgba(255, 255, 255, 0.75)",
          backdropPadding: 2,
        },
        angleLines: {
          display: true,
          color: "rgba(0, 0, 0, 0.2)",
        },
        grid: {
          circular: true,
          color: "rgba(0, 0, 0, 0.2)",
        },
        pointLabels: {
          font: {
            size: isMobile ? 8 : 12,
          },
          color: "#333",
          padding: isMobile ? 6 : 10,
        },
        startAngle: 0, // Start from top
      },
    },
    plugins: {
      legend: {
        display: !showAllCategories,
        position: "top" as const,
        labels: {
          font: {
            size: 14,
          },
        },
      },
      tooltip: {
        callbacks: {
          title: function (tooltipItems: any) {
            const index = tooltipItems[0].dataIndex;
            const metrics = getAllMetrics();
            return metrics[index];
          },
          label: function (context: any) {
            const value = context.raw;
            let label = context.dataset.label || "";
            return `${label}: ${value.toFixed(1)}`;
          },
        },
      },
    },
    elements: {
      line: {
        tension: 0.2, // Makes the lines slightly curved
      },
    },
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        // Remove category if it's already selected
        return prev.filter((c) => c !== category);
      } else {
        // Add category if it's not selected
        return [...prev, category];
      }
    });
  };

  const getChartHeight = () => {
    if (isMobile) return 300;
    if (isTablet) return 400;
    return 500;
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-2">
      <div className="mb-6">
        <h1 className="text-center text-2xl md:text-3xl font-bold text-blue-600 mb-2 animate-pulse w-full">
          FISH CAPITAL: Design 1
        </h1>

        {/* View selector */}
        <div className="flex justify-center gap-4 mb-4">
          <button
            className={`px-4 py-2 rounded-full font-medium transition-all ${
              showAllCategories
                ? "bg-purple-600 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
            onClick={() => {
              setShowAllCategories(true);
              setSelectedCategories(Object.keys(fish_categories));
            }}
          >
            Combined View
          </button>
          <button
            className={`px-4 py-2 rounded-full font-medium transition-all ${
              !showAllCategories
                ? "bg-purple-600 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
            onClick={() => setShowAllCategories(false)}
          >
            Category Comparison
          </button>
        </div>

        {/* Category selector (only visible in category comparison view) */}
        {!showAllCategories && (
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {Object.keys(fish_categories).map((category) => {
              const isActive = selectedCategories.includes(category);
              const color =
                categoryColors[category as keyof typeof categoryColors];

              return (
                <button
                  key={category}
                  className={`${
                    isMobile ? "px-2 py-1 text-xs" : "px-4 py-2 text-base"
                  } rounded-full font-medium transition-all ${
                    isActive
                      ? "text-white shadow-md"
                      : "text-gray-700 bg-gray-100 hover:bg-gray-200"
                  }`}
                  style={{
                    backgroundColor: isActive ? color.borderColor : undefined,
                  }}
                  onClick={() => toggleCategory(category)}
                >
                  {category}
                </button>
              );
            })}
          </div>
        )}

        {/* Statistics display */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4 p-2 bg-gray-50 rounded-lg">
          {Object.keys(categoryAverages).map((category) => (
            <div
              key={category}
              className="text-center p-2 rounded bg-white shadow-sm"
            >
              <div
                className={`${isMobile ? "text-xs" : "text-sm"} text-gray-500`}
              >
                {category}
              </div>
              <div
                className={`font-bold ${isMobile ? "text-base" : "text-lg"}`}
                style={{
                  color:
                    categoryColors[category as keyof typeof categoryColors]
                      .borderColor,
                }}
              >
                {categoryAverages[
                  category as keyof typeof categoryAverages
                ].toFixed(1)}
              </div>
            </div>
          ))}

          <div className="text-center p-2 rounded bg-white shadow-sm">
            <div
              className={`${isMobile ? "text-xs" : "text-sm"} text-gray-500`}
            >
              Total Average
            </div>
            <div
              className={`font-bold ${
                isMobile ? "text-base" : "text-lg"
              } text-purple-600`}
            >
              {totalAverage.toFixed(1)}
            </div>
          </div>
        </div>
      </div>

      {/* Chart container */}
      <div
        style={{
          height: getChartHeight(),
          width: "100%",
          position: "relative",
        }}
      >
        <Radar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default CircularRadarVisualization;
