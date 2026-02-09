/**
 * Model Pricing Configuration
 * Prices are in USD per million tokens (MTok)
 * 
 * Update these values when pricing changes
 */

export interface ModelPricing {
  name: string;
  displayName: string;
  inputPricePerMTok: number;  // $ per million input tokens
  outputPricePerMTok: number; // $ per million output tokens
  color: string; // For charts
}

export const MODEL_PRICING: Record<string, ModelPricing> = {
  "claude-sonnet-4": {
    name: "claude-sonnet-4",
    displayName: "Sonnet 4",
    inputPricePerMTok: 3,
    outputPricePerMTok: 15,
    color: "#10b981", // emerald
  },
  "claude-3-5-sonnet": {
    name: "claude-3-5-sonnet",
    displayName: "Sonnet 3.5",
    inputPricePerMTok: 3,
    outputPricePerMTok: 15,
    color: "#22c55e", // green
  },
  "claude-opus-4": {
    name: "claude-opus-4",
    displayName: "Opus 4",
    inputPricePerMTok: 15,
    outputPricePerMTok: 75,
    color: "#8b5cf6", // violet
  },
  "claude-3-opus": {
    name: "claude-3-opus",
    displayName: "Opus 3",
    inputPricePerMTok: 15,
    outputPricePerMTok: 75,
    color: "#a855f7", // purple
  },
  "claude-3-haiku": {
    name: "claude-3-haiku",
    displayName: "Haiku 3",
    inputPricePerMTok: 0.25,
    outputPricePerMTok: 1.25,
    color: "#06b6d4", // cyan
  },
  "gpt-4o": {
    name: "gpt-4o",
    displayName: "GPT-4o",
    inputPricePerMTok: 2.5,
    outputPricePerMTok: 10,
    color: "#3b82f6", // blue
  },
  "gpt-4o-mini": {
    name: "gpt-4o-mini",
    displayName: "GPT-4o Mini",
    inputPricePerMTok: 0.15,
    outputPricePerMTok: 0.6,
    color: "#60a5fa", // light blue
  },
  // Default/unknown model
  "unknown": {
    name: "unknown",
    displayName: "Unknown",
    inputPricePerMTok: 3,
    outputPricePerMTok: 15,
    color: "#6b7280", // gray
  },
};

/**
 * Get pricing for a model, with fallback to default
 */
export function getModelPricing(modelName: string): ModelPricing {
  // Normalize model name
  const normalizedName = modelName.toLowerCase()
    .replace(/anthropic\//g, "")
    .replace(/openai\//g, "")
    .replace(/-20\d{6}$/g, "") // Remove date suffixes
    .trim();
  
  // Try exact match
  if (MODEL_PRICING[normalizedName]) {
    return MODEL_PRICING[normalizedName];
  }
  
  // Try partial match
  for (const [key, pricing] of Object.entries(MODEL_PRICING)) {
    if (normalizedName.includes(key) || key.includes(normalizedName)) {
      return pricing;
    }
  }
  
  // Check for sonnet/opus/haiku keywords
  if (normalizedName.includes("sonnet")) {
    return MODEL_PRICING["claude-sonnet-4"];
  }
  if (normalizedName.includes("opus")) {
    return MODEL_PRICING["claude-opus-4"];
  }
  if (normalizedName.includes("haiku")) {
    return MODEL_PRICING["claude-3-haiku"];
  }
  
  return MODEL_PRICING["unknown"];
}

/**
 * Calculate cost for a given number of tokens
 */
export function calculateCost(
  modelName: string,
  tokensIn: number,
  tokensOut: number
): number {
  const pricing = getModelPricing(modelName);
  const inputCost = (tokensIn / 1_000_000) * pricing.inputPricePerMTok;
  const outputCost = (tokensOut / 1_000_000) * pricing.outputPricePerMTok;
  return inputCost + outputCost;
}

/**
 * Get all model names for display
 */
export function getAllModels(): ModelPricing[] {
  return Object.values(MODEL_PRICING).filter(m => m.name !== "unknown");
}
