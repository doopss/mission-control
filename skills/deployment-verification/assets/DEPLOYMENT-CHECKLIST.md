# Deployment Verification Checklist

Copy this checklist to your project and fill it out before declaring any deployment complete.

## 🔍 Pre-Deployment Audit

### Environment Variables
- [ ] Audited all .env files (.env, .env.local, .env.development, .env.production)
- [ ] Documented dev vs prod backend URLs
- [ ] Verified production environment variables are set in hosting platform (Vercel/Netlify/etc.)
- [ ] Confirmed no secrets committed to git

### Backend Deployments
- [ ] Listed all backend services (database, API, storage, etc.)
- [ ] Identified dev vs prod deployments for each service
- [ ] Documented which deployment serves production traffic
- [ ] Verified code uses correct deployment URLs for each environment

## 🚀 Deployment Process

### Pre-Deploy
- [ ] Code pushed to correct git branch (main/production)
- [ ] CI/CD pipeline triggered (if applicable)
- [ ] Build logs reviewed for errors or warnings
- [ ] Environment-specific configs verified

### Deploy
- [ ] Deployment started on hosting platform
- [ ] Build completed successfully
- [ ] No deployment errors or rollbacks
- [ ] New deployment is live at production URL

## ✅ Post-Deployment Verification

### Frontend Verification
- [ ] Hard refresh production URL (Cmd/Ctrl + Shift + R)
- [ ] Tested in actual production environment (not localhost)
- [ ] Network tab shows correct API endpoints
- [ ] No console errors in browser DevTools
- [ ] UI renders correctly with production data

### Backend Verification
- [ ] Ran verify-prod script to check data landed in production
- [ ] Queried backend directly via dashboard/CLI to confirm data exists
- [ ] Verified timestamps show recent activity
- [ ] Checked production logs for errors
- [ ] Confirmed data is in prod deployment, not dev

### Data Integrity
- [ ] New records visible in production database/backend
- [ ] File uploads accessible if applicable
- [ ] Search/query functions return expected results
- [ ] Related records properly linked

### User-Facing Verification
- [ ] Tested critical user flows end-to-end
- [ ] Verified new features work as expected
- [ ] Confirmed no regressions in existing functionality
- [ ] Mobile responsive if applicable

## 🐛 Common Gotchas

**Dev vs Prod Split:**
- [ ] Confirmed not logging to dev backend when production should use prod
- [ ] Verified environment variable precedence (.env.production > .env.local > .env)
- [ ] Checked that CI/CD uses production secrets, not local dev secrets

**Caching Issues:**
- [ ] Hard refreshed browser to bypass cache
- [ ] Cleared CDN cache if using one (Cloudflare, etc.)
- [ ] Verified service workers updated if using PWA

**Async Deployments:**
- [ ] If backend and frontend deploy separately, confirmed both are updated
- [ ] If using database migrations, confirmed they ran successfully
- [ ] If using queue/workers, confirmed jobs processed

## 📝 Sign-Off

**Deployment Date:** _________  
**Deployed By:** _________  
**Production URL:** _________  
**Backend URLs:** _________  

**Verification Status:**
- [ ] All checks passed
- [ ] Ready to announce deployment complete

**Notes:**
_________________________________________
_________________________________________
_________________________________________
