import React, { useState, useEffect, useRef } from "react";

// FISH Capital types definitions
const FISH_TYPES = [
  "Liquidity & Cash Flow",
  "Debt Management",
  "Funding Flexibility",
  "Market Insights",
  "Innovation & R&D",
  "Adaptability",
  "Networking & Partnerships",
  "Reputation & Trust",
  "Influence & Engagement",
  "Expertise & Skill Levels",
  "Experience & Leadership",
  "Capacity for Growth & Talent Pipeline",
] as const;

type FISH_TYPES = (typeof FISH_TYPES)[number];

// Type display names (shortened for cleaner display)
const TYPE_DISPLAY_NAMES: Record<FISH_TYPES, string> = {
  "Liquidity & Cash Flow": "Liquidity & Cash Flow",
  "Debt Management": "Debt Management",
  "Funding Flexibility": "Funding Flexibility",
  "Market Insights": "Market Insights",
  "Innovation & R&D": "Innovation & R&D",
  Adaptability: "Adaptability",
  "Networking & Partnerships": "Networking & Partnerships",
  "Reputation & Trust": "Reputation & Trust",
  "Influence & Engagement": "Influence & Engagement",
  "Expertise & Skill Levels": "Expertise & Skill Levels",
  "Experience & Leadership": "Experience & Leadership",
  "Capacity for Growth & Talent Pipeline": "Capacity for Growth",
};

// Group types by category
const TYPE_CATEGORIES: Record<string, FISH_TYPES[]> = {
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

// Sample data - replace with actual data
const sampleData = {
  "Liquidity & Cash Flow": 4.2,
  "Debt Management": 3.8,
  "Funding Flexibility": 2.7,
  "Market Insights": 4.5,
  "Innovation & R&D": 3.9,
  Adaptability: 3.2,
  "Networking & Partnerships": 4.7,
  "Reputation & Trust": 3.8,
  "Influence & Engagement": 2.9,
  "Expertise & Skill Levels": 4.3,
  "Experience & Leadership": 3.6,
  "Capacity for Growth & Talent Pipeline": 3.1,
};

// Category colors
const CATEGORY_COLORS: Record<string, string> = {
  Financial: "bg-blue-500",
  Intellectual: "bg-green-500",
  Social: "bg-red-500",
  Human: "bg-yellow-500",
};

// Category lighter colors for backgrounds
const CATEGORY_BG_COLORS: Record<string, string> = {
  Financial: "bg-blue-100",
  Intellectual: "bg-green-100",
  Social: "bg-red-100",
  Human: "bg-yellow-100",
};

// Category text colors
const CATEGORY_TEXT_COLORS: Record<string, string> = {
  Financial: "text-blue-700",
  Intellectual: "text-green-700",
  Social: "text-red-700",
  Human: "text-yellow-700",
};

// Category border colors
const CATEGORY_BORDER_COLORS: Record<string, string> = {
  Financial: "border-blue-500",
  Intellectual: "border-green-500",
  Social: "border-red-500",
  Human: "border-yellow-500",
};

// Get category for a specific type
const getCategoryForType = (type: FISH_TYPES): string => {
  return (
    Object.entries(TYPE_CATEGORIES).find(([, types]) =>
      types.includes(type)
    )?.[0] || ""
  );
};

const FISHCapitalBarChart = () => {
  const [data, setData] = useState(sampleData);
  const [animatedData, setAnimatedData] = useState<Record<FISH_TYPES, number>>(
    {} as any
  );
  const [isAnimating, setIsAnimating] = useState(true);
  const [sortBy, setSortBy] = useState("category"); // 'category', 'value-asc', 'value-desc'
  const [selectedCategories, setSelectedCategories] = useState(
    Object.keys(TYPE_CATEGORIES)
  );
  const [isMobile, setIsMobile] = useState(false);
  const animationRef = useRef(0);

  // Initialize animated data with zeros
  useEffect(() => {
    const initialAnimatedData = {} as Record<FISH_TYPES, number>;
    Object.keys(data).forEach((key) => {
      initialAnimatedData[key as FISH_TYPES] = 0;
    });
    setAnimatedData(initialAnimatedData);

    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Animation effect
  useEffect(() => {
    if (!isAnimating) return;

    let startTime: number | null = null;
    const duration = 1500; // Animation duration in ms

    const animateData = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const newAnimatedData = {} as Record<FISH_TYPES, number>;
      Object.entries(data).forEach(([key, targetValue]) => {
        // Easing function for smoother animation
        const easedProgress = easeOutCubic(progress);
        newAnimatedData[key as FISH_TYPES] = targetValue * easedProgress;
      });

      setAnimatedData(newAnimatedData);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animateData);
      } else {
        setIsAnimating(false);
      }
    };

    animationRef.current = requestAnimationFrame(animateData);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isAnimating, data]);

  // Easing function
  const easeOutCubic = (x: number) => {
    return 1 - Math.pow(1 - x, 3);
  };

  // Restart animation
  const restartAnimation = () => {
    setIsAnimating(true);
  };

  // Toggle category selection
  const toggleCategory = (category: FISH_TYPES) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((c) => c !== category);
      } else {
        return [...prev, category];
      }
    });
    restartAnimation();
  };

  // Sort data based on current sort parameter
  const getSortedData = () => {
    const visibleTypes = FISH_TYPES.filter((type) => {
      const category = getCategoryForType(type);
      return selectedCategories.includes(category);
    });

    if (sortBy === "category") {
      // Sort by category, then by value within category
      return [...visibleTypes].sort((a, b) => {
        const catA = getCategoryForType(a);
        const catB = getCategoryForType(b);

        if (catA !== catB) {
          return (
            Object.keys(TYPE_CATEGORIES).indexOf(catA) -
            Object.keys(TYPE_CATEGORIES).indexOf(catB)
          );
        }

        // If same category, sort by value (descending)
        return data[b] - data[a];
      });
    } else if (sortBy === "value-asc") {
      return [...visibleTypes].sort((a, b) => data[a] - data[b]);
    } else {
      return [...visibleTypes].sort((a, b) => data[b] - data[a]);
    }
  };

  // Calculate category statistics
  const calculateCategoryStats = () => {
    const stats = {} as Record<string, number>;

    Object.entries(TYPE_CATEGORIES).forEach(([category, types]) => {
      let sum = 0;
      let count = 0;

      types.forEach((type) => {
        if (data[type]) {
          sum += data[type];
          count++;
        }
      });

      stats[category as FISH_TYPES] =
        count > 0 ? parseFloat((sum / count).toFixed(1)) : 0;
    });

    // Calculate total average
    let totalSum = 0;
    let totalCount = 0;

    Object.values(data).forEach((value) => {
      totalSum += value;
      totalCount++;
    });

    stats["Total"] =
      totalCount > 0 ? parseFloat((totalSum / totalCount).toFixed(1)) : 0;

    return stats;
  };

  const categoryStats = calculateCategoryStats();
  const sortedTypes = getSortedData();
  const maxValue = Math.max(...Object.values(data), 5); // Maximum for scaling

  return (
    <div className="flex flex-col items-center w-full max-w-6xl mx-auto p-4">
      {/* Header */}
      <h1 className="text-2xl md:text-3xl font-bold text-blue-600 mb-4">
        FISH CAPITAL
      </h1>

      {/* Controls row */}
      <div className="flex flex-wrap justify-between items-center w-full mb-4 gap-2">
        {/* Sort controls */}
        <div className="flex gap-2">
          <button
            className={`px-3 py-1 rounded-full text-sm transition-all ${
              sortBy === "category"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-black"
            }`}
            onClick={() => setSortBy("category")}
          >
            By Category
          </button>
          <button
            className={`px-3 py-1 rounded-full text-sm transition-all ${
              sortBy === "value-desc"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-black"
            }`}
            onClick={() => setSortBy("value-desc")}
          >
            Highest First
          </button>
          <button
            className={`px-3 py-1 rounded-full text-sm transition-all ${
              sortBy === "value-asc"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-black"
            }`}
            onClick={() => setSortBy("value-asc")}
          >
            Lowest First
          </button>
        </div>

        {/* Animation button */}
        <button
          className="px-3 py-1 rounded-full bg-indigo-500 text-white shadow-sm text-sm transition-all hover:bg-indigo-600"
          onClick={restartAnimation}
        >
          Animate
        </button>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap justify-center gap-2 mb-6 w-full">
        {Object.keys(TYPE_CATEGORIES).map((category) => (
          <button
            key={category}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
              selectedCategories.includes(category)
                ? CATEGORY_COLORS[category] + " text-white"
                : "bg-gray-200 text-black"
            }`}
            onClick={() => toggleCategory(category as FISH_TYPES)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Statistics display */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-6 w-full">
        {Object.entries(categoryStats).map(([category, value]) => {
          const bgColor =
            category !== "Total" ? CATEGORY_BG_COLORS[category] : "bg-blue-50";
          const textColor =
            category !== "Total"
              ? CATEGORY_TEXT_COLORS[category]
              : "text-blue-700";

          return (
            <div
              key={category}
              className={`text-center p-3 rounded ${bgColor} transition-all`}
            >
              <div className="text-sm text-black">{category}</div>
              <div className={`text-xl font-bold ${textColor}`}>
                {isAnimating ? "..." : value.toFixed(1)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bar chart */}
      <div className="w-full bg-white rounded-lg shadow-md p-4">
        <div className="space-y-4">
          {sortedTypes.map((type) => {
            const value = animatedData[type] || 0;
            const percentage = (value / maxValue) * 100;
            const category = getCategoryForType(type);

            return (
              <div key={type} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <div className="font-medium truncate max-w-xs text-gray-500">
                    {TYPE_DISPLAY_NAMES[type] || type}
                  </div>
                  <div className="font-bold text-black">
                    {isAnimating ? "..." : data[type].toFixed(1)}
                  </div>
                </div>

                <div className="relative h-6 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`absolute left-0 top-0 h-full rounded-full transition-all duration-1000 ${CATEGORY_COLORS[category]}`}
                    style={{ width: `${percentage}%` }}
                  ></div>

                  {/* Markers for measurement */}
                  <div className="absolute left-0 top-0 h-full w-full">
                    {[0, 25, 50, 75, 100].map((marker) => (
                      <div
                        key={marker}
                        className="absolute top-0 h-full border-r border-white opacity-50"
                        style={{
                          left: `${
                            (marker / 100) * maxValue * (100 / maxValue)
                          }%`,
                        }}
                      ></div>
                    ))}
                  </div>
                </div>

                {/* Category tag */}
                <div className="flex justify-between text-xs">
                  <span
                    className={`${CATEGORY_TEXT_COLORS[category]}  font-medium`}
                  >
                    {category}
                  </span>

                  {/* Scale markers */}
                  <div className="text-black">
                    {sortBy === "category" &&
                      type ===
                        sortedTypes.find(
                          (t) => getCategoryForType(t) === category
                        ) && (
                        <div className="flex justify-between w-48 sm:w-64">
                          {[0, 1, 2, 3, 4, 5].map((marker) => (
                            <span key={marker} className="text-xs text-black">
                              {marker}
                            </span>
                          ))}
                        </div>
                      )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Scale indicator */}
        <div className="mt-6 text-center">
          <div className="flex justify-between px-4 text-xs text-black">
            <span>0</span>
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-2 w-full">
        {Object.entries(TYPE_CATEGORIES).map(([category, types]) => (
          <div
            key={category}
            className={`p-2 rounded-lg ${CATEGORY_BG_COLORS[category]} border ${CATEGORY_BORDER_COLORS[category]}`}
          >
            <div className={`font-bold ${CATEGORY_TEXT_COLORS[category]} mb-1`}>
              {category}
            </div>
            <div className="text-xs text-black">
              {types.map((type) => (
                <div key={type} className="truncate">
                  • {TYPE_DISPLAY_NAMES[type]}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FISHCapitalBarChart;
