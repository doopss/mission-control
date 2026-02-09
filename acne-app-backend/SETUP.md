# Acne App Backend - Setup Guide

**Created:** 2026-02-08 9:15 AM EST  
**Status:** Database schema designed, ready for deployment

---

## ✅ Completed

1. **Supabase CLI installed** (`brew install supabase/tap/supabase`)
2. **Project initialized** (`acne-app-backend/`)
3. **Database schema designed** (see `supabase/migrations/20260208_initial_schema.sql`)

---

## 📊 Database Schema Overview

### Core Tables

**user_profiles** - User preferences and subscription status
- Pain point, budget tier, beauty philosophy
- Subscription tracking
- Analytics (total analyses, last analysis date)

**products** - Skincare product database
- Product info (name, brand, price, description, image)
- Categorization (type, acne type, key ingredients)
- Filter tags (budget tier, philosophy, sensitive skin safe)
- Affiliate links (Amazon, Sephora, Ulta, YesStyle)
- Full-text search enabled

**analyses** - AI photo analysis results
- Photo storage reference
- Acne type, severity, distribution
- Detailed scores (hydration, texture, inflammation, clarity, pores, dark spots)
- Overall score (0-100)
- AI model tracking + confidence
- User feedback

**recommendations** - Product recommendations per analysis
- Ranked recommendations (1, 2, 3)
- Reasoning + usage instructions
- Routine placement (morning/night, step order)
- Click/purchase tracking

**user_history** - "What worked/didn't work" tracking
- Product/ingredient tracking
- Effectiveness ratings
- Status (tried, working, not_working, caused_reaction)
- Duration tracking

**progress_tracking** - Photo comparison over time
- Baseline vs follow-up analysis
- Improvement percentage
- Areas improved/worsened
- AI-generated progress summary

### Security

- **Row Level Security (RLS)** enabled on all tables
- Users can only access their own data
- Products are public read-only
- Admin-only write access for products table

### Performance

- Indexes on foreign keys
- GIN indexes for array columns (ingredients, acne types)
- Full-text search on products
- Auto-updating timestamps

---

## 🚀 Next Steps

### Option 1: Deploy to Supabase Cloud (Recommended for Production)

1. **Create Supabase project:**
   ```bash
   # Visit https://supabase.com/dashboard
   # Create new project: "acne-app-mvp" or similar
   # Choose region: us-east-1 (closest to East Coast)
   # Copy project URL and API keys
   ```

2. **Link local project:**
   ```bash
   cd acne-app-backend
   supabase link --project-ref YOUR_PROJECT_REF
   ```

3. **Push migrations:**
   ```bash
   supabase db push
   ```

4. **Verify schema:**
   ```bash
   supabase db diff
   ```

### Option 2: Run Locally (for Development)

1. **Start local Supabase:**
   ```bash
   cd acne-app-backend
   supabase start
   ```
   
   This will:
   - Start PostgreSQL locally
   - Apply migrations
   - Start API gateway
   - Start Studio (UI) at http://localhost:54323

2. **Get local credentials:**
   ```bash
   supabase status
   ```
   
   Copy:
   - API URL
   - anon key
   - service_role key

---

## 📝 Configuration Files Needed

### `.env` (for backend)
```env
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_KEY=eyJ... # For server-side operations

# AI Provider
GOOGLE_GEMINI_API_KEY=AIza... # Get from https://aistudio.google.com/app/apikey
OPENAI_API_KEY=sk-... # Fallback

# Affiliate APIs
AMAZON_PRODUCT_API_KEY=...
AMAZON_ASSOCIATE_TAG=...
```

### `.env.local` (for React Native app)
```env
EXPO_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

---

## 🗄️ Storage Buckets Setup

Run these in Supabase Dashboard or SQL Editor:

```sql
-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) 
VALUES 
    ('user-photos', 'user-photos', false),
    ('analysis-results', 'analysis-results', false),
    ('product-images', 'product-images', true);

-- Storage policies for user photos
CREATE POLICY "Users can upload own photos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'user-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view own photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'user-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Product images are publicly viewable
CREATE POLICY "Product images are public"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');
```

---

## 🔐 Auth Configuration

In Supabase Dashboard → Authentication:

1. **Enable auth providers:**
   - ✅ Email/Password
   - ✅ Apple (for iOS)
   - ✅ Google

2. **Email templates:**
   - Customize confirmation email
   - Customize password reset email

3. **URL configuration:**
   - Site URL: `acneapp://` (deep link for mobile)
   - Redirect URLs: Add your app's deep link scheme

---

## 🧪 Testing the Setup

### 1. Create a test user:
```sql
-- Run in Supabase SQL Editor
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at)
VALUES (
    uuid_generate_v4(),
    'test@example.com',
    crypt('password123', gen_salt('bf')),
    NOW()
);
```

### 2. Insert sample products:
```sql
INSERT INTO products (name, brand, price_usd, product_type, budget_tier, key_ingredients, beauty_philosophy)
VALUES 
    ('CeraVe Acne Foaming Cream Cleanser', 'CeraVe', 14.99, 'cleanser', 'under_50', 
     ARRAY['benzoyl_peroxide', 'hyaluronic_acid', 'niacinamide'], 
     ARRAY['western_clinical', 'minimalist']),
    
    ('COSRX Acne Pimple Master Patch', 'COSRX', 6.00, 'treatment', 'under_50',
     ARRAY['hydrocolloid'], 
     ARRAY['k_beauty', 'minimalist']),
    
    ('Paula''s Choice 2% BHA Liquid Exfoliant', 'Paula''s Choice', 32.00, 'treatment', 'under_50',
     ARRAY['salicylic_acid'], 
     ARRAY['western_clinical', 'clean']);
```

### 3. Test RLS policies:
```sql
-- Should only return current user's data
SELECT * FROM user_profiles;
SELECT * FROM analyses;
```

---

## 📋 Checklist

- [ ] Supabase project created
- [ ] Migrations applied
- [ ] Storage buckets configured
- [ ] Auth providers enabled
- [ ] Environment variables set
- [ ] Sample products inserted
- [ ] RLS policies tested
- [ ] API keys obtained (Gemini, Amazon)

---

## 🔗 Resources

- Supabase Dashboard: https://supabase.com/dashboard
- Supabase Docs: https://supabase.com/docs
- Google Gemini API: https://aistudio.google.com/app/apikey
- Amazon Product API: https://webservices.amazon.com/paapi5/documentation/

---

**Next Task:** API endpoint development (Edge Functions)
