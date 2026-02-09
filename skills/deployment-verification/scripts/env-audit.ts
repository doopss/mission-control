#!/usr/bin/env ts-node
/**
 * Environment Audit Script
 * 
 * Scans project for environment variables and backend deployments
 * to identify dev vs prod configurations
 */

import * as fs from "fs";
import * as path from "path";

interface EnvFile {
  name: string;
  path: string;
  vars: Record<string, string>;
}

interface BackendDeployment {
  service: string;
  env: "dev" | "prod" | "unknown";
  url: string;
  source: string;
}

function parseEnvFile(filePath: string): Record<string, string> {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const vars: Record<string, string> = {};
    
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#")) {
        const match = trimmed.match(/^([^=]+)=(.*)$/);
        if (match) {
          vars[match[1].trim()] = match[2].trim();
        }
      }
    }
    
    return vars;
  } catch {
    return {};
  }
}

function findEnvFiles(dir: string): EnvFile[] {
  const envFiles: EnvFile[] = [];
  const envFileNames = [".env", ".env.local", ".env.development", ".env.production"];
  
  for (const name of envFileNames) {
    const filePath = path.join(dir, name);
    if (fs.existsSync(filePath)) {
      envFiles.push({
        name,
        path: filePath,
        vars: parseEnvFile(filePath)
      });
    }
  }
  
  return envFiles;
}

function identifyBackendDeployments(envFiles: EnvFile[]): BackendDeployment[] {
  const deployments: BackendDeployment[] = [];
  
  for (const envFile of envFiles) {
    for (const [key, value] of Object.entries(envFile.vars)) {
      // Convex
      if (key.includes("CONVEX") && (value.includes("http") || value.includes("convex.cloud"))) {
        const isDev = value.includes("dev:") || envFile.name.includes("development") || envFile.name === ".env.local";
        deployments.push({
          service: "Convex",
          env: isDev ? "dev" : "prod",
          url: value,
          source: `${envFile.name}: ${key}`
        });
      }
      
      // Supabase
      if (key.includes("SUPABASE") && value.includes("supabase")) {
        deployments.push({
          service: "Supabase",
          env: "unknown",
          url: value,
          source: `${envFile.name}: ${key}`
        });
      }
      
      // Vercel
      if (key.includes("VERCEL") && value.includes("http")) {
        deployments.push({
          service: "Vercel",
          env: "unknown",
          url: value,
          source: `${envFile.name}: ${key}`
        });
      }
      
      // Generic API endpoints
      if ((key.includes("API") || key.includes("URL")) && value.includes("http")) {
        const isDev = value.includes("localhost") || value.includes("127.0.0.1") || value.includes("dev");
        deployments.push({
          service: "API",
          env: isDev ? "dev" : "unknown",
          url: value,
          source: `${envFile.name}: ${key}`
        });
      }
    }
  }
  
  return deployments;
}

function auditProject(projectDir: string) {
  console.log("🔍 Environment Audit");
  console.log("=".repeat(60));
  console.log();
  
  // Find env files
  const envFiles = findEnvFiles(projectDir);
  
  if (envFiles.length === 0) {
    console.log("⚠️  No .env files found in project root");
    return;
  }
  
  console.log("📄 Environment Files Found:");
  for (const envFile of envFiles) {
    const varCount = Object.keys(envFile.vars).length;
    console.log(`  • ${envFile.name} (${varCount} variables)`);
  }
  console.log();
  
  // Identify backend deployments
  const deployments = identifyBackendDeployments(envFiles);
  
  if (deployments.length === 0) {
    console.log("ℹ️  No backend deployment URLs detected");
    return;
  }
  
  console.log("🌐 Backend Deployments Detected:");
  console.log();
  
  const grouped = deployments.reduce((acc, dep) => {
    if (!acc[dep.service]) acc[dep.service] = [];
    acc[dep.service].push(dep);
    return acc;
  }, {} as Record<string, BackendDeployment[]>);
  
  for (const [service, deps] of Object.entries(grouped)) {
    console.log(`  ${service}:`);
    for (const dep of deps) {
      const envLabel = dep.env === "dev" ? "🔧 DEV" : dep.env === "prod" ? "🚀 PROD" : "❓ UNKNOWN";
      console.log(`    ${envLabel} | ${dep.url}`);
      console.log(`           Source: ${dep.source}`);
    }
    console.log();
  }
  
  // Warning if multiple environments detected
  for (const [service, deps] of Object.entries(grouped)) {
    if (deps.length > 1) {
      const hasMultipleEnvs = new Set(deps.map(d => d.env)).size > 1;
      if (hasMultipleEnvs) {
        console.log(`⚠️  WARNING: Multiple ${service} deployments detected (dev + prod)`);
        console.log(`   Ensure your code uses the correct deployment for each environment`);
        console.log();
      }
    }
  }
}

// CLI usage
const projectDir = process.argv[2] || process.cwd();
auditProject(projectDir);
