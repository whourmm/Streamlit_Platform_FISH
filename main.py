import streamlit as st
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import plotly.graph_objects as go
import seaborn as sns

# Define metrics grouped by FISH categories
fish_categories = {
    "Financial": ["Liquidity & Cash Flow", "Debt Management", "Funding Flexibility"],
    "Intellectual": ["Market Insights", "Innovation & R&D", "Adaptability"],
    "Social": ["Networking & Partnerships", "Reputation & Trust", "Influence & Engagement"],
    "Human": ["Expertise & Skill Levels", "Experience & Leadership", "Capacity for Growth & Talent Pipeline"]
}

category_mapping = {}
for category, metrics in fish_categories.items():
    for metric in metrics:
        category_mapping[metric] = category

metrics = sum(fish_categories.values(), [])  # Flatten into a single list

# Generate random scores for multiple tools
np.random.seed(42)
tools = ["Tool A", "Tool B", "Tool C", "Tool D", "Tool E"]
data = {"Tool": tools}

for metric in metrics:
    data[metric] = np.random.randint(1, 6, size=len(tools))  # Random scores (1-5)

df = pd.DataFrame(data)

# Streamlit UI
st.title("📊 Tools Strength Comparison (FISH Framework)")
st.sidebar.header("Select Tools")
selected_tools = st.sidebar.multiselect("Choose tools:", tools, default=tools[:3])

# Filter data based on selection
filtered_data = df[df["Tool"].isin(selected_tools)]

# Function to plot radar chart with customized background and labels
def plot_radar_chart(data, labels, title, is_fish_summary=False, first=False):
    N = len(labels)

    if is_fish_summary:
        # Define custom angles for the whole metrics (12 metrics)
        custom_degrees = [25, 25, 40, 25, 25, 40, 25, 25, 40, 25, 25, 40]
        assert len(custom_degrees) == N, "Length of custom_degrees must match the number of labels"
        assert sum(custom_degrees) == 360, "Custom degrees must sum to 360°"
        
        # Convert degrees to radians and apply 30° clockwise rotation
        custom_radians = np.deg2rad(np.cumsum([0] + custom_degrees[:-1])) + np.pi / 9
        theta = np.append(custom_radians, custom_radians[0])  # Close the loop
    else:
        # Evenly distribute angles for non-summary charts (individual F, I, S, H)
        theta = np.linspace(0, 2 * np.pi, N, endpoint=False)
        theta = np.concatenate([theta, [theta[0]]])  # Close the loop

    # Set up the plot
    sns.set(style="whitegrid")
    colors = sns.color_palette("deep", len(data))

    fig, ax = plt.subplots(figsize=(8, 8), subplot_kw={'projection': 'polar'})

    ax.set_title(title, y=1.1, fontsize=16, fontweight='bold', color='#333')
    ax.set_theta_zero_location("N")
    ax.set_theta_direction(-1)
    ax.set_rlabel_position(90)
    ax.spines['polar'].set_color('lightgrey')

    # Define FISH category colors for borders and background (grayscale)
    fish_colors = {
        "Financial": "#888888",  # Gray shades for labels
        "Intellectual": "#888888",
        "Social": "#888888",
        "Human": "#888888"
    }

    fish_background_colors = {
        "Financial": (0.8, 0.8, 0.8, 0.4),  # Lighter gray with transparency
        "Intellectual": (0.7, 0.7, 0.7, 0.4),
        "Social": (0.6, 0.6, 0.6, 0.4),
        "Human": (0.5, 0.5, 0.5, 0.4)
    }

    # Plot each tool's scores
    for idx, (i, row) in enumerate(data.iterrows()):
        values = row[labels].values.flatten().tolist()
        values.append(values[0])  # Ensure it closes

        # Ensure length of theta and values match
        assert len(theta) == len(values), f"Mismatch: theta({len(theta)}) != values({len(values)})"

        ax.plot(theta, values, linewidth=2, linestyle='solid', label=row['Tool'], marker='o', markersize=6, color=colors[idx])
        ax.fill(theta, values, alpha=0.3, color=colors[idx])

    ax.legend(loc='upper right', bbox_to_anchor=(1.3, 1.1), fontsize=9, frameon=False)

    if first:
        category_angles = {}  # Store angles for annotation
        start_idx = 0

        # Draw FISH category background and borders
        for category, category_metrics in fish_categories.items():
            end_idx = start_idx + len(category_metrics)
            cat_theta = np.concatenate([[0], theta[start_idx:end_idx], [0]])  # Start at center
            cat_values = [0] + [6] * len(category_metrics) + [0]  # Extend to 6

            # Fill the background only in the defined range
            ax.fill(cat_theta, cat_values, color=fish_background_colors[category], alpha=0.3)

            # Draw the category border with solid lines (not dashed)
            ax.plot(theta[start_idx:end_idx], [6] * len(category_metrics), linestyle='solid', linewidth=2, label=category, color=fish_colors[category])

            # Compute angle for category label
            avg_angle = np.mean(theta[start_idx:end_idx])
            category_angles[category] = avg_angle

            start_idx = end_idx

        # Add category labels outside the chart
        for category, angle in category_angles.items():
            ax.text(angle, 4.5, category, ha='center', va='center', fontsize=12, fontweight='bold', color=fish_colors[category], 
                    bbox=dict(facecolor='white', alpha=0.7, edgecolor='gray'))
        
    # Hide radial grid lines outside colored backgrounds
    ax.yaxis.grid(True, linestyle='dotted', linewidth=0.8, color='grey')

    # Adjust y-axis ticks and theta labels
    plt.yticks([1, 2, 3, 4, 5], ['1', '2', '3', '4', '5'], color="black", size=10)
    plt.xticks(theta[:-1], labels, color='black', size=10 if is_fish_summary else 8, rotation=20)

    return fig

# Function to calculate FISH total scores
def calculate_fish_scores(data, fish_categories):
    fish_scores = []
    for _, row in data.iterrows():
        scores = {category: row[metrics].sum()/3 for category, metrics in fish_categories.items()}
        scores["Tool"] = row["Tool"]
        fish_scores.append(scores)
    return pd.DataFrame(fish_scores)

# Generate plots
if not filtered_data.empty:
    # 1️⃣ Main Radar Chart (FISH summary)
    fig = plot_radar_chart(filtered_data, metrics, title="Tools Strength Comparison (FISH)", is_fish_summary=True, first=True)
    st.pyplot(fig)

    # 2️⃣ Radar Chart for FISH Total Scores
    fish_df = calculate_fish_scores(filtered_data, fish_categories)
    st.subheader("🛠️ Overall FISH Category Scores")
    fish_radar = plot_radar_chart(fish_df, list(fish_categories.keys()), title="FISH Category Comparison", is_fish_summary=False)
    st.pyplot(fish_radar)

    # 3️⃣-6️⃣ Individual Radar Charts for each FISH group
    for category, category_metrics in fish_categories.items():
        st.subheader(f"📊 {category} Category Breakdown")
        category_radar = plot_radar_chart(filtered_data, category_metrics, title=f"{category} Category Breakdown", is_fish_summary=False)
        st.pyplot(category_radar)

else:
    st.warning("Please select at least one tool to visualize.")
