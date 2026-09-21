// icp.js — the default "Ideal Customer Profile".
// This is the salesperson's definition of a good lead. Everything is scored
// against it. In a real deployment each user/team would save their own ICP.
const DEFAULT_ICP = {
  industries: ["SaaS", "E-commerce", "Fintech", "Healthcare Tech", "Marketing"],
  minEmployees: 10,
  maxEmployees: 500,
  locations: ["United States", "Canada", "United Kingdom"],
  techSignals: ["Shopify", "HubSpot", "Salesforce", "Stripe", "Intercom"],
  minRevenue: 1_000_000,
  maxRevenue: 100_000_000
};

module.exports = { DEFAULT_ICP };
