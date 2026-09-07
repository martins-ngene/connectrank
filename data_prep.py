import pandas as pd

# Load CSV, skipping the initial 3 comment lines LinkedIn includes
df = pd.read_csv("Connections.csv", skiprows=3)

# Keep relevant columns and drop rows missing role information
df = df[["First Name", "Last Name", "URL", "Company", "Position", "Connected On"]].dropna(subset=["Position", "Company"])

# Combine fields into a single search document
df["profile_doc"] = df["Position"] + " at " + df["Company"]

df.to_parquet("cleaned_connections.parquet", index=False)
print(f"Loaded {len(df)} connections.")