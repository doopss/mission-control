---
name: deployment-verification
description: Verify deployments reached production correctly. Use before declaring any deployment "complete" or "live", especially when working with projects that have separate dev/prod backend deployments (Convex, Supabase, Firebase, etc.), multiple environment files, or when debugging "not showing up in production" issues. Includes environment audit, production verification scripts, and deployment checklist.
---

# Deployment Verification

Systematic verification that deployments actually work in production, not just locally.

## Core Problem

Common deployment failures:
- Code pushed to dev backend, prod reads from prod backend
- Environment variables point to localhost or dev URLs
- Build succeeds but data missing in production
- Caching issues hide deployment failures
- "Works on my machine" but not in production

## When to Use

**Always run before declaring deployment complete:**
- After pushing code to production
- After merging to main/production branch
- After Vercel/Netlify deployment completes
- After backend schema/function changes
- When debugging "data not showing up" issues

**Especially critical when:**
- Project has dev AND prod backend deployments
- Multiple .env files exist (.env.local, .env.production)
- Backend service has multiple environments (Convex dev/prod, Supabase projects)
- Code makes API calls that could target wrong environment

## Quick Start

### 1. Environment Audit

Run first to understand dev vs prod configuration:

```bash
npx tsx skills/deployment-verification/scripts/env-audit.ts
```

Or for a specific project directory:

```bash
npx tsx skills/deployment-verification/scripts/env-audit.ts /path/to/project
```

**What it does:**
- Scans all .env files in project
- Identifies backend deployment URLs (Convex, Supabase, APIs)
- Labels each as DEV, PROD, or UNKNOWN
- Warns if multiple environments detected

**When to run:**
- Before first deployment of new project
- When adding new backend services
- When debugging "wrong environment" issues
- When onboarding to existing project

### 2. Production Verification

Create a custom script to verify data landed in production:

```bash
cp skills/deployment-verification/scripts/verify-prod.template.ts scripts/verify-prod.ts
```

Edit `scripts/verify-prod.ts` to:
1. Set production backend URL
2. Add authentication if needed
3. Query backend to verify recent data
4. Check timestamps to ensure data is fresh

Run after every deployment:

```bash
npx tsx scripts/verify-prod.ts
```

**Example customization for Convex:**

```typescript
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";

const PROD_URL = "https://your-prod-deployment.convex.cloud";
const client = new ConvexHttpClient(PROD_URL);

async function verifyProduction() {
  const recentItems = await client.query(api.items.recent, { limit: 10 });
  
  console.log(`✅ Found ${recentItems.length} items in production`);
  
  for (const item of recentItems) {
    console.log(`  • ${item.title} (${new Date(item.timestamp).toLocaleString()})`);
  }
}
```

### 3. Deployment Checklist

Copy checklist to project root:

```bash
cp skills/deployment-verification/assets/DEPLOYMENT-CHECKLIST.md PROJECT-DEPLOYMENT-CHECKLIST.md
```

Fill out before declaring deployment complete. Use as a forcing function to verify each critical step.

## Step-by-Step Workflow

### Before Deployment

1. **Audit environment**
   ```bash
   npx tsx skills/deployment-verification/scripts/env-audit.ts
   ```

2. **Document findings**
   - List dev vs prod URLs for each backend service
   - Confirm code uses correct deployment for each environment
   - Update README with deployment URLs

3. **Verify environment variables**
   - Check hosting platform (Vercel/Netlify dashboard)
   - Confirm production environment variables set correctly
   - Ensure no dev URLs in production config

### During Deployment

4. **Monitor deployment**
   - Watch build logs for errors
   - Verify build completes successfully
   - Check deployment didn't auto-rollback

5. **Initial check**
   - Visit production URL (not localhost)
   - Hard refresh (Cmd/Ctrl + Shift + R)
   - Check browser console for errors

### After Deployment

6. **Verify production data**
   ```bash
   npx tsx scripts/verify-prod.ts
   ```

7. **Test critical paths**
   - Create new record via UI
   - Verify it appears in production backend
   - Check timestamps are recent
   - Query backend directly if possible

8. **Checklist sign-off**
   - Fill out PROJECT-DEPLOYMENT-CHECKLIST.md
   - Confirm all boxes checked
   - Only then declare "deployment complete"

## Common Patterns by Backend

### Convex

**Problem:** Dev deployment (from .env.local) vs prod deployment (from Convex dashboard)

**Verification:**
```typescript
const PROD_URL = "https://your-prod-slug.convex.cloud";
const client = new ConvexHttpClient(PROD_URL);
const data = await client.query(api.yourTable.list, {});
```

**Check:** Convex dashboard → Deployments → Verify prod deployment has recent functions/data

### Supabase

**Problem:** Multiple Supabase projects (dev vs prod)

**Verification:**
```bash
npx supabase db dump --db-url "postgresql://..." --schema public
```

**Check:** Supabase dashboard → Table Editor → Verify recent rows exist

### Firebase

**Problem:** Dev vs prod projects, emulator vs live

**Verification:**
```typescript
const app = initializeApp(prodConfig);
const db = getFirestore(app);
const snapshot = await getDocs(collection(db, "items"));
```

**Check:** Firebase console → Firestore → Verify recent documents

## Integration with Existing Workflows

### Add to AGENTS.md

```markdown
**Before declaring deployment complete:**
Run the `deployment-verification` skill to verify production.
```

### Add to package.json

```json
{
  "scripts": {
    "verify-prod": "npx tsx scripts/verify-prod.ts",
    "deploy:full": "npm run build && npm run verify-prod"
  }
}
```

### Add to CI/CD

```yaml
- name: Verify Production
  run: npx tsx scripts/verify-prod.ts
```

## Prevention Strategies

### 1. Separate Config Files Clearly

```
.env              # Never commit (local overrides)
.env.local        # Dev deployment URLs (gitignored)
.env.production   # Prod deployment URLs (can commit non-secrets)
.env.example      # Template for setup (commit)
```

### 2. Use Explicit Environment Variables

Instead of:
```typescript
const url = process.env.NEXT_PUBLIC_CONVEX_URL;
```

Use:
```typescript
const url = process.env.NODE_ENV === 'production'
  ? process.env.PROD_CONVEX_URL
  : process.env.DEV_CONVEX_URL;
```

### 3. Fail Fast on Misconfiguration

```typescript
if (!process.env.PROD_API_URL) {
  throw new Error("PROD_API_URL not set");
}
```

### 4. Log Environment on Startup

```typescript
console.log("Environment:", process.env.NODE_ENV);
console.log("Backend URL:", process.env.CONVEX_URL?.substring(0, 30) + "...");
```

## Lessons Learned

From Mission Control deployment (Feb 9, 2026):

**Problem:** Activities logged to dev Convex deployment didn't show in production.

**Root cause:** 
- `.env.local` pointed to dev deployment
- Production Vercel used different env vars
- Logger script used .env.local by default
- All logging went to dev, prod remained empty

**Solution:**
- Ran env-audit.ts to discover both deployments
- Deployed backend functions to prod
- Re-logged data to prod deployment
- Updated logger to use prod by default

**Takeaway:** Always verify which backend deployment your code targets in production.

## Troubleshooting

### "Data not showing in production"

1. Run env-audit.ts to list all deployments
2. Check which deployment code actually uses
3. Query both dev and prod to find where data landed
4. Verify production code points to production backend

### "Works locally but not in production"

1. Hard refresh production URL (clear cache)
2. Check browser console for errors
3. Verify production environment variables set correctly
4. Test in incognito/private browsing mode

### "Build succeeds but site broken"

1. Check deployment logs for runtime errors
2. Verify all dependencies installed in production
3. Check for environment-specific code paths
4. Test with production API keys (not dev keys)

## File Reference

- `scripts/env-audit.ts` - Environment variable and backend deployment scanner
- `scripts/verify-prod.template.ts` - Template for production verification script
- `assets/DEPLOYMENT-CHECKLIST.md` - Comprehensive deployment checklist template
