// Fixed vocabularies shared by the content schema and filters.
// Adding a value here also requires adding it to content/schema/role.schema.json.

export const LEVELS = [
  { id: 6, label: "Level 6", qualification: "Bachelor's degree" },
  { id: 7, label: "Level 7", qualification: "Master's degree" },
] as const;

export type Level = (typeof LEVELS)[number]["id"];

export const SECTORS = [
  "Accounting & Audit",
  "Banking & Finance",
  "Business & Management",
  "Construction & Property",
  "Consulting",
  "Consumer & Retail",
  "Creative & Media",
  "Defence & Aerospace",
  "Education",
  "Energy & Utilities",
  "Engineering",
  "Healthcare & Life Sciences",
  "Insurance",
  "Law",
  "Public Sector",
  "Technology",
  "Telecoms",
  "Transport & Logistics",
] as const;

export type Sector = (typeof SECTORS)[number];
