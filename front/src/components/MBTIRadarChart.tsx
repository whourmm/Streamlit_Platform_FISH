import React, { useEffect, useState, useRef } from "react";

// MBTI type definitions
const MBTI_TYPES = [
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

const MBTI_TYPE_LOOKUP: Record<MBTIType, string> = {
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
const TYPE_CATEGORIES: Record<string, MBTIType[]> = {
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
const sampleTeamData = {
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

// Category colors for the background
const CATEGORY_COLORS: Record<string, string> = {
  Financial: "rgba(0, 123, 255, 0.2)", // Blue
  Intellectual: "rgba(40, 167, 69, 0.2)", // Green
  Social: "rgba(220, 53, 69, 0.2)", // Red
  Human: "rgba(255, 193, 7, 0.2)", // Yellow
};

// Darker colors for buttons and UI elements
const CATEGORY_BUTTON_COLORS: Record<string, string> = {
  Financial: "rgba(0, 123, 255, 1)", // Blue
  Intellectual: "rgba(40, 167, 69, 1)", // Green
  Social: "rgba(220, 53, 69, 1)", // Red
  Human: "rgba(255, 193, 7, 1)", // Yellow
};

type MBTIType = (typeof MBTI_TYPES)[number];

// Get category for a specific MBTI type
const getCategoryForType = (type: MBTIType): string => {
  return (
    Object.entries(TYPE_CATEGORIES).find(([, types]) =>
      types.includes(type)
    )?.[0] || ""
  );
};

// Component for MBTI Radar Chart
const MBTIRadarChart = () => {
  const [teamData, setTeamData] =
    useState<Record<MBTIType, number>>(sampleTeamData);
  const [animatedData, setAnimatedData] = useState<Record<MBTIType, number>>(
    {} as any
  );
  const [teamAverageType, setTeamAverageType] = useState<MBTIType>(
    "Liquidity & Cash Flow"
  );
  const [teamLackingType, setTeamLackingType] = useState<MBTIType>(
    "Liquidity & Cash Flow"
  );
  const [isAnimating, setIsAnimating] = useState(true);
  const animationRef = useRef(0);

  // New state for category selection
  const [showAllCategories, setShowAllCategories] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    Object.keys(TYPE_CATEGORIES)
  );
  const [windowWidth, setWindowWidth] = useState(0);
  const containerRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  // Initialize animated data with zeros
  useEffect(() => {
    const initialAnimatedData = {} as Record<MBTIType, number>;
    Object.keys(teamData).forEach((key) => {
      initialAnimatedData[key as MBTIType] = 0;
    });
    setAnimatedData(initialAnimatedData);
  }, []);

  // Animation effect
  useEffect(() => {
    if (!isAnimating) return;

    let startTime: number | null = null;
    const duration = 1500; // Animation duration in ms

    const animateRadarData = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const newAnimatedData = {} as Record<MBTIType, number>;
      Object.entries(teamData).forEach(([key, targetValue]) => {
        // Easing function: cubic-bezier
        const easedProgress = cubicBezier(0.34, 1.56, 0.64, 1)(progress);
        newAnimatedData[key as MBTIType] = targetValue * easedProgress;
      });

      setAnimatedData(newAnimatedData);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animateRadarData);
      } else {
        setIsAnimating(false);
      }
    };

    animationRef.current = requestAnimationFrame(animateRadarData);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isAnimating, teamData]);

  // Cubic bezier easing function
  const cubicBezier = (x1: number, y1: number, x2: number, y2: number) => {
    return (t: number) => {
      const u = 1 - t;
      const tt = t * t;
      const uu = u * u;
      const uuu = uu * u;
      const ttt = tt * t;

      return 3 * uu * t * x1 + 3 * u * tt * x2 + ttt;
    };
  };

  // Handle resizing for responsive layout
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);

      if (containerRef.current) {
        const container = containerRef.current as HTMLDivElement;
        const rect = container.getBoundingClientRect();
        setContainerSize({
          width: rect.width,
          height: Math.min(rect.width * 0.8, window.innerHeight * 0.6),
        });
      }
    };

    // Initialize window width and container size
    handleResize();

    window.addEventListener("resize", handleResize);

    // Trigger animation when window is resized
    const debounceResize = setTimeout(() => {
      setIsAnimating(true);
    }, 300);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(debounceResize);
    };
  }, []);

  // Restart animation when categories change
  useEffect(() => {
    setIsAnimating(true);
  }, [selectedCategories, showAllCategories]);

  // Determine if mobile based on window width
  const isMobile = windowWidth < 768;

  // Calculate dimensions
  const getChartDimensions = () => {
    const padding = isMobile ? 20 : 40;
    const availableWidth = containerSize.width - padding * 2;
    const size = Math.min(availableWidth, containerSize.height);
    const center = size / 2;
    const radius = center - (isMobile ? 40 : 60);

    return { size, center, radius };
  };

  const { size, center, radius } = getChartDimensions();

  // Calculate maximum value for scaling
  const maxValue = Math.max(...Object.values(teamData), 5);

  // Get visible MBTI types based on selected categories
  const getVisibleMBTITypes = (): MBTIType[] => {
    if (showAllCategories) {
      return [...MBTI_TYPES];
    }

    const visibleTypes: MBTIType[] = [];
    selectedCategories.forEach((category) => {
      const typesInCategory = TYPE_CATEGORIES[category] || [];
      visibleTypes.push(...typesInCategory);
    });

    return visibleTypes;
  };

  // Calculate positions for each MBTI type
  const getCoordinates = () => {
    const coords: Record<
      MBTIType,
      { x: number; y: number; angle: number; labelX: number; labelY: number }
    > = {} as any;

    const visibleTypes = getVisibleMBTITypes();
    const angleStep = (2 * Math.PI) / visibleTypes.length;

    visibleTypes.forEach((type, i) => {
      const angle = i * angleStep - Math.PI / 2; // Start at top
      coords[type] = {
        x: center + Math.cos(angle) * radius,
        y: center + Math.sin(angle) * radius,
        labelX: center + Math.cos(angle) * (radius + (isMobile ? 15 : 25)),
        labelY: center + Math.sin(angle) * (radius + (isMobile ? 15 : 25)),
        angle,
      };
    });

    return coords;
  };

  const coordinates = getCoordinates();
  const visibleTypes = getVisibleMBTITypes();

  // Create polygon points for data visualization
  const createPolygonPoints = (scale = 1) => {
    return visibleTypes
      .map((type) => {
        const value = (animatedData[type] * scale) / maxValue;
        const coord = coordinates[type];
        const distance = value * radius;
        const x = center + Math.cos(coord.angle) * distance;
        const y = center + Math.sin(coord.angle) * distance;
        return `${x},${y}`;
      })
      .join(" ");
  };

  // Create axes
  const createAxes = () => {
    return visibleTypes.map((type) => {
      const coord = coordinates[type];
      return (
        <line
          key={`axis-${type}`}
          x1={center}
          y1={center}
          x2={coord.x}
          y2={coord.y}
          stroke="#ccc"
          strokeWidth="1"
        />
      );
    });
  };

  // Create concentric circles for the grid
  const createGrid = () => {
    const circles = [];
    const steps = 5;

    for (let i = 1; i <= steps; i++) {
      const circleRadius = (radius * i) / steps;
      circles.push(
        <circle
          key={`grid-${i}`}
          cx={center}
          cy={center}
          r={circleRadius}
          fill="none"
          stroke="#ccc"
          strokeWidth="1"
          strokeDasharray="2,2"
          opacity={isAnimating ? Math.min(1, i * 0.2) : 1}
        />
      );
    }

    return circles;
  };

  // Create category background sections
  const createCategorySections = () => {
    const sections = [];

    for (const [category, types] of Object.entries(TYPE_CATEGORIES)) {
      // Skip if category not selected
      if (!showAllCategories && !selectedCategories.includes(category)) {
        continue;
      }

      // Filter types to only include those visible in the current view
      const visibleCategoryTypes = types.filter((type) =>
        visibleTypes.includes(type)
      );

      if (visibleCategoryTypes.length === 0) {
        continue;
      }

      const firstTypeIdx = visibleTypes.indexOf(visibleCategoryTypes[0]);
      const lastTypeIdx = visibleTypes.indexOf(
        visibleCategoryTypes[visibleCategoryTypes.length - 1]
      );

      if (firstTypeIdx === -1 || lastTypeIdx === -1) {
        continue;
      }

      const startAngle =
        (firstTypeIdx * 2 * Math.PI) / visibleTypes.length - Math.PI / 2;
      const endAngle =
        ((lastTypeIdx + 1) * 2 * Math.PI) / visibleTypes.length - Math.PI / 2;

      // Calculate path for the section
      const path = describeArc(
        center,
        center,
        radius,
        (startAngle * 180) / Math.PI,
        (endAngle * 180) / Math.PI
      );

      sections.push(
        <path
          key={`section-${category}`}
          d={`M ${center},${center} L ${
            center + Math.cos(startAngle) * radius
          },${center + Math.sin(startAngle) * radius} 
              ${path} Z`}
          fill={CATEGORY_COLORS[category]}
          stroke="none"
          opacity={isAnimating ? 0.7 : 1}
          className="transition-opacity duration-500"
        />
      );
    }

    return sections;
  };

  // Helper function to calculate arc path
  const describeArc = (
    x: number,
    y: number,
    radius: number,
    startAngle: number,
    endAngle: number
  ) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return ["A", radius, radius, 0, largeArcFlag, 0, start.x, start.y].join(
      " "
    );
  };

  const polarToCartesian = (
    centerX: number,
    centerY: number,
    radius: number,
    angleInDegrees: number
  ) => {
    const angleInRadians = (angleInDegrees * Math.PI) / 180;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  // Create data bars for each type
  const createDataBars = () => {
    return visibleTypes.map((type, index) => {
      const coord = coordinates[type];
      const value = animatedData[type] / maxValue;
      const barWidth = (2 * Math.PI * radius) / (visibleTypes.length * 5); // Adjust bar width

      // Calculate bar path
      const innerRadius = 0;
      const outerRadius = value * radius;
      const startAngle = coord.angle - Math.PI / visibleTypes.length;
      const endAngle = coord.angle + Math.PI / visibleTypes.length;

      // Create wedge-shaped bar
      const x1 = center + Math.cos(startAngle) * innerRadius;
      const y1 = center + Math.sin(startAngle) * innerRadius;
      const x2 = center + Math.cos(startAngle) * outerRadius;
      const y2 = center + Math.sin(startAngle) * outerRadius;
      const x3 = center + Math.cos(endAngle) * outerRadius;
      const y3 = center + Math.sin(endAngle) * outerRadius;
      const x4 = center + Math.cos(endAngle) * innerRadius;
      const y4 = center + Math.sin(endAngle) * innerRadius;

      // Get category for type to add color variation
      const category = getCategoryForType(type);
      const categoryColor =
        CATEGORY_BUTTON_COLORS[category] || "rgba(135, 206, 235, 0.7)";
      const hoverEffect = isAnimating
        ? ""
        : "hover:filter hover:brightness-110 cursor-pointer";

      // Add an animation delay based on the index
      const animationDelay = index * 30;

      return (
        <g key={`bar-group-${type}`}>
          <path
            key={`bar-${type}`}
            d={`M ${x1},${y1} L ${x2},${y2} A ${outerRadius},${outerRadius} 0 0 1 ${x3},${y3} L ${x4},${y4} Z`}
            fill="rgba(135, 206, 235, 0.7)"
            stroke={categoryColor}
            strokeWidth="1.5"
            className={`transition-all duration-300 ${hoverEffect}`}
            style={{
              filter: `saturate(${isAnimating ? 1.5 : 1})`,
              opacity: isAnimating ? 0.9 : 1,
              transform: isAnimating ? "scale(1.02)" : "scale(1)",
              transformOrigin: `${center}px ${center}px`,
            }}
          >
            <title>
              {type}: {teamData[type].toFixed(1)}
            </title>
          </path>
          {/* Value label at the end of the bar */}
          <text
            x={center + Math.cos(coord.angle) * (outerRadius + 5)}
            y={center + Math.sin(coord.angle) * (outerRadius + 5)}
            textAnchor="middle"
            alignmentBaseline="middle"
            fontSize={isMobile ? "8" : "10"}
            fontWeight="bold"
            fill="#333"
            opacity={isAnimating ? 0 : 1}
            className="transition-opacity duration-300 delay-500"
          >
            {teamData[type].toFixed(1)}
          </text>
        </g>
      );
    });
  };

  // Create area polygon showing all data
  const createDataPolygon = () => {
    const points = createPolygonPoints();
    return (
      <polygon
        points={points}
        fill="rgba(65, 105, 225, 0.2)"
        stroke="rgba(65, 105, 225, 0.8)"
        strokeWidth="1.5"
        className="transition-all duration-500"
        style={{
          opacity: isAnimating ? 0.7 : 0.4,
        }}
      />
    );
  };

  // Create labels for each MBTI type
  const createLabels = () => {
    return visibleTypes.map((type, index) => {
      const coord = coordinates[type];
      const angle = coord.angle * (180 / Math.PI);

      // Adjust for text alignment
      let textAnchor = "middle";
      if (angle > -45 && angle < 45) textAnchor = "start";
      else if (angle > 135 || angle < -135) textAnchor = "end";

      // Get category for type to add color variation
      const category = getCategoryForType(type);
      const categoryColor = CATEGORY_BUTTON_COLORS[category] || "#333";

      // Add animation delay based on index
      const animationDelay = index * 30;

      return (
        <g
          key={`label-${type}`}
          className="transition-opacity duration-300"
          style={{
            opacity: isAnimating ? 0.7 : 1,
          }}
        >
          <text
            x={coord.labelX}
            y={coord.labelY}
            textAnchor={textAnchor}
            alignmentBaseline="middle"
            fontSize={isMobile ? "10" : "12"}
            fontWeight="bold"
            fill={categoryColor}
            className="transition-all duration-300 hover:font-bold"
          >
            {MBTI_TYPE_LOOKUP[type]}
          </text>
          <text
            x={coord.labelX}
            y={coord.labelY + (isMobile ? 10 : 14)}
            textAnchor={textAnchor}
            alignmentBaseline="middle"
            fontSize={isMobile ? "8" : "10"}
            fill="#555"
          >
            {isMobile && type.length > 15
              ? `${type.substring(0, 12)}...`
              : type}
          </text>
        </g>
      );
    });
  };

  // Create legend
  const createLegend = () => {
    return (
      <g
        transform={`translate(${size - (isMobile ? 10 : 20)}, 20)`}
        className="transition-transform duration-500"
        style={{ opacity: isAnimating ? 0.7 : 1 }}
      >
        <rect
          x="0"
          y="0"
          width={isMobile ? "110" : "140"}
          height={isMobile ? "100" : "120"}
          fill="white"
          fillOpacity="0.8"
          rx="5"
          ry="5"
          className="shadow-lg"
        />
        {/* Categories */}
        {Object.keys(CATEGORY_COLORS).map((category, index) => (
          <g
            key={`legend-${category}`}
            className="transition-opacity duration-300"
            style={{ opacity: 0.9 }}
          >
            <rect
              x="10"
              y={10 + index * 20}
              width="15"
              height="15"
              fill={CATEGORY_COLORS[category]}
              stroke={CATEGORY_BUTTON_COLORS[category]}
              strokeWidth="1"
              rx="2"
              className="transition-all duration-300 hover:filter hover:brightness-110"
            />
            <text
              x="30"
              y={22 + index * 20}
              fontSize={isMobile ? "10" : "12"}
              fill="#333"
            >
              {category}
            </text>
          </g>
        ))}
      </g>
    );
  };

  // Calculate category statistics for displaying
  const calculateCategoryStats = () => {
    const stats: Record<string, number> = {};

    Object.entries(TYPE_CATEGORIES).forEach(([category, types]) => {
      let sum = 0;
      let count = 0;

      types.forEach((type) => {
        sum += teamData[type];
        count++;
      });

      stats[category] = count > 0 ? parseFloat((sum / count).toFixed(1)) : 0;
    });

    // Calculate total average
    let totalSum = 0;
    let totalCount = 0;

    Object.values(teamData).forEach((value) => {
      totalSum += value;
      totalCount++;
    });

    stats["Total"] =
      totalCount > 0 ? parseFloat((totalSum / totalCount).toFixed(1)) : 0;

    return stats;
  };

  const categoryStats = calculateCategoryStats();

  // Toggle category selection
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

  // Restart animation
  const restartAnimation = () => {
    setIsAnimating(true);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-6xl mx-auto px-2 md:px-4">
      <h1 className="text-2xl md:text-3xl font-bold text-blue-600 mb-2 animate-pulse">
        FISH CAPITAL
      </h1>

      {/* View selector buttons with animation */}
      <div className="flex justify-center gap-2 md:gap-4 mb-4 w-full">
        <button
          className={`px-3 md:px-4 py-1 md:py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
            showAllCategories
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-200 text-gray-800"
          }`}
          onClick={() => {
            setShowAllCategories(true);
            setSelectedCategories(Object.keys(TYPE_CATEGORIES));
          }}
        >
          <span className="text-sm md:text-base">All Types</span>
        </button>
        <button
          className={`px-3 md:px-4 py-1 md:py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
            !showAllCategories
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-200 text-gray-800"
          }`}
          onClick={() => setShowAllCategories(false)}
        >
          <span className="text-sm md:text-base">Select Categories</span>
        </button>

        <button
          className="px-3 md:px-4 py-1 md:py-2 rounded-full font-medium bg-indigo-500 text-white shadow-md transition-all duration-300 transform hover:scale-105 ml-auto"
          onClick={restartAnimation}
        >
          <span className="text-sm md:text-base">Animate</span>
        </button>
      </div>

      {/* Category selector buttons with animation (only shown when category selection is enabled) */}
      {!showAllCategories && (
        <div className="flex flex-wrap justify-center gap-2 mb-4 transition-all duration-500">
          {Object.keys(TYPE_CATEGORIES).map((category) => {
            const isActive = selectedCategories.includes(category);
            return (
              <button
                key={category}
                className={`px-3 md:px-4 py-1 md:py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
                  isActive
                    ? "text-white shadow-md"
                    : "bg-gray-200 text-gray-800"
                }`}
                style={{
                  backgroundColor: isActive
                    ? CATEGORY_BUTTON_COLORS[category]
                    : undefined,
                }}
                onClick={() => toggleCategory(category)}
              >
                <span className="text-xs md:text-sm">{category}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Statistics display with animation */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4 p-2 bg-gray-50 rounded-lg w-full transition-all duration-500">
        {Object.entries(categoryStats).map(([category, value], index) => {
          // Animation delay based on index
          const animationDelay = index * 100;

          return (
            <div
              key={category}
              className="text-center p-2 rounded bg-white shadow-sm transition-all duration-500 transform hover:shadow-md hover:scale-105"
              style={{
                animationDelay: `${animationDelay}ms`,
                opacity: isAnimating ? 0.8 : 1,
              }}
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
                    category === "Total"
                      ? "rgb(59, 130, 246)" // blue-600
                      : CATEGORY_BUTTON_COLORS[category] || "black",
                }}
              >
                {isAnimating ? "..." : value}
              </div>
            </div>
          );
        })}
      </div>

      {/* Radar chart container with responsive sizing */}
      <div
        ref={containerRef}
        className="relative w-full flex justify-center transition-all duration-500 border border-gray-200 rounded-lg shadow-lg overflow-hidden bg-white"
        style={{ height: containerSize.height }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${size} ${size}`}
          className="transition-all duration-500"
        >
          {/* Create category background sections */}
          {createCategorySections()}

          {/* Create the grid */}
          {createGrid()}

          {/* Create axes */}
          {createAxes()}

          {/* Create data polygon */}
          {createDataPolygon()}

          {/* Create data bars */}
          {createDataBars()}

          {/* Create labels */}
          {createLabels()}

          {/* Create legend */}
          {createLegend()}

          {/* Center dot */}
          <circle
            cx={center}
            cy={center}
            r={3}
            fill="#333"
            className="transition-all duration-500"
            style={{
              opacity: isAnimating ? 0.5 : 1,
              transform: isAnimating ? "scale(0.8)" : "scale(1)",
            }}
          />
        </svg>

        {/* Loading indicator during animation */}
        {isAnimating && (
          <div className="absolute top-2 right-2 text-sm text-blue-500 font-medium bg-white bg-opacity-70 px-2 py-1 rounded-full">
            Loading...
          </div>
        )}
      </div>
    </div>
  );
};

export default MBTIRadarChart;
