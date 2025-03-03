# FISH Capital Visualization

A responsive React component for visualizing FISH Capital metrics across Financial, Intellectual, Social, and Human capital domains.


## Overview

This interactive dashboard visualizes the FISH Capital framework, which measures organizational capital across four key dimensions:
- **F**inancial Capital: Liquidity & Cash Flow, Debt Management, Funding Flexibility
- **I**ntellectual Capital: Market Insights, Innovation & R&D, Adaptability
- **S**ocial Capital: Networking & Partnerships, Reputation & Trust, Influence & Engagement
- **H**uman Capital: Expertise & Skill Levels, Experience & Leadership, Capacity for Growth

## Features

- **Interactive Bar Chart**: Visual representation of all 12 FISH metrics
- **Category Filtering**: Toggle visibility of specific capital categories
- **Multiple Sorting Options**: Sort metrics by category, highest values, or lowest values
- **Animated Transitions**: Smooth animations when changing views or loading data
- **Responsive Design**: Optimized for both desktop and mobile viewing
- **Category Averages**: Real-time calculation of average scores across categories
- **Color-Coded System**: Intuitive color scheme for easy category recognition

## Installation

```bash
# Add the component to your React project
cd ./frontend/
npm install
```

## Usage

```tsx
## Data Format

The component expects data in the following format:

```typescript
const fishData = {
  "Liquidity & Cash Flow": 4.2,
  "Debt Management": 3.8,
  "Funding Flexibility": 2.7,
  "Market Insights": 4.5,
  "Innovation & R&D": 3.9,
  "Adaptability": 3.2,
  "Networking & Partnerships": 4.7,
  "Reputation & Trust": 3.8,
  "Influence & Engagement": 2.9,
  "Expertise & Skill Levels": 4.3,
  "Experience & Leadership": 3.6,
  "Capacity for Growth & Talent Pipeline": 3.1
};
```

All values should be on a scale of 0-5, with 5 being the highest possible score.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `object` | Sample data | FISH metrics with values |
| `initialSort` | `string` | 'category' | Initial sort order ('category', 'value-asc', 'value-desc') |
| `showAnimation` | `boolean` | `true` | Whether to show animation on load |
| `showLegend` | `boolean` | `true` | Whether to display the category legend |
| `maxValue` | `number` | `5` | Maximum value for scaling the chart |

## Customization

The component uses Tailwind CSS for styling. You can customize the appearance by:

1. Modifying the color constants in the component:
```typescript
const CATEGORY_COLORS = {
  Financial: "bg-blue-500",
  Intellectual: "bg-green-500",
  Social: "bg-red-500",
  Human: "bg-yellow-500",
};
```

2. Adding custom class names through props:
```tsx
<FISHCapitalBarChart className="your-custom-class" />
```

## Development

```bash
# Clone the repository
git clone https://github.com/yourusername/fish-capital-visualization.git

# Install dependencies
cd fish-capital-visualization
npm install

# Start development server
npm run dev
```

## Browser Support

- Chrome: Latest
- Firefox: Latest
- Safari: Latest
- Edge: Latest
- Opera: Latest


## Acknowledgements

- This visualization is based on the FISH Capital framework
- Built with React and Tailwind CSS
- Animation powered by requestAnimationFrame
