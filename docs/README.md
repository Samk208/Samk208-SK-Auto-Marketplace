# SK AutoSphere - PRD Documentation Package

**Generated:** November 6, 2025  
**Version:** 2.0  
**For:** Next.js 14 + Supabase + React Native Project

---

## 📦 What's Included

This package contains a comprehensive, multi-file PRD structure optimized for AI-assisted development with **Cursor** or **Claude Code**.

### Core Documents

1. **PRD.md** - Main navigation hub and project overview
2. **02-TECHNICAL-STACK.md** - Complete technical architecture, stack details, and deployment setup
3. **03-FEATURES-CORE.md** - Detailed user stories with implementation code for core features
4. **04-FEATURES-AI.md** - Gemini AI integration with complete code examples
5. **05-DATABASE-SCHEMA.md** - Full Supabase database design with migrations and RLS policies
6. **CLAUDE.md** - Project context file for Claude Code (put in project root)
7. **.cursorrules** - Cursor IDE configuration (put in project root)

### Additional Documents (To Be Created)

You can extend this PRD with:
- **01-PROJECT-OVERVIEW.md** - Detailed vision, personas, and business goals
- **06-API-INTEGRATIONS.md** - Third-party API specifications
- **07-MOBILE-APP.md** - React Native mobile strategy
- **08-I18N-STRATEGY.md** - Internationalization implementation
- **09-ROADMAP.md** - Development timeline and milestones
- **10-DEPLOYMENT.md** - Netlify/Vercel deployment guides

---

## 🚀 How to Use This PRD

### For Cursor AI Users

1. **Copy all files to your project root:**
   ```bash
   cp PRD.md 02-TECHNICAL-STACK.md 03-FEATURES-CORE.md 04-FEATURES-AI.md 05-DATABASE-SCHEMA.md /path/to/project/docs/
   cp .cursorrules /path/to/project/
   ```

2. **Start Cursor and open your project**

3. **Reference documents in prompts:**
   ```
   "Using the authentication pattern from 03-FEATURES-CORE.md, 
   implement Google OAuth login with Supabase"
   ```

4. **Cursor will automatically:**
   - Follow the coding standards in `.cursorrules`
   - Reference the PRD documents when relevant
   - Maintain consistency with your tech stack

### For Claude Code Users

1. **Copy files to your project:**
   ```bash
   cp PRD.md 02-TECHNICAL-STACK.md 03-FEATURES-CORE.md 04-FEATURES-AI.md 05-DATABASE-SCHEMA.md /path/to/project/docs/
   cp CLAUDE.md /path/to/project/
   ```

2. **Start Claude Code:**
   ```bash
   cd /path/to/project
   claude
   ```

3. **Claude Code automatically reads `CLAUDE.md`** on startup

4. **Reference documents in prompts:**
   ```
   "Following the pattern in 03-FEATURES-CORE.md, create the 
   car listing detail page with seller card component"
   ```

### For Other AI Tools or Manual Development

1. **Start with `PRD.md`** - Get the big picture
2. **Check `02-TECHNICAL-STACK.md`** - Understand the architecture
3. **Reference `03-FEATURES-CORE.md`** - Find implementation examples
4. **Use `05-DATABASE-SCHEMA.md`** - Set up your database
5. **Integrate AI with `04-FEATURES-AI.md`** - Add Gemini features

---

## 🎯 Recommended Workflow

### Phase 1: Project Setup

```bash
# 1. Initialize Next.js project
npx create-next-app@latest sk-autosphere --typescript --tailwind --app

# 2. Install Supabase
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs

# 3. Copy CLAUDE.md or .cursorrules to project root

# 4. Set up environment variables (see 02-TECHNICAL-STACK.md)
cp .env.example .env.local
# Edit .env.local with your Supabase credentials
```

### Phase 2: Database Setup

1. **Create Supabase project** at supabase.com
2. **Run migrations from `05-DATABASE-SCHEMA.md`**
3. **Generate TypeScript types:**
   ```bash
   npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/supabase.ts
   ```

### Phase 3: Core Features Development

**Use AI assistance with specific references:**

```
// Example Cursor prompt
"Based on AUTH-01 in 03-FEATURES-CORE.md, implement the user 
registration form with email/password signup, including the 
Supabase auth trigger for auto-profile creation"

// Example Claude Code prompt
"Following the pattern in SELL-02 from 03-FEATURES-CORE.md, 
create the multi-step car listing form with image upload to 
Supabase Storage"
```

### Phase 4: AI Features

1. **Set up Gemini API** (get key from Google AI Studio)
2. **Reference `04-FEATURES-AI.md`** for implementation patterns
3. **Start with AI-01 (Description Generator)** - easiest to implement
4. **Move to AI-06 (Translation)** - high business value

---

## 💡 Pro Tips for AI-Assisted Development

### With Cursor

1. **Use `@docs` to reference PRD files:**
   ```
   @docs/03-FEATURES-CORE.md implement the favorites feature
   ```

2. **Reference multiple files:**
   ```
   Using @docs/02-TECHNICAL-STACK.md and @docs/05-DATABASE-SCHEMA.md, 
   set up the Supabase client with proper types
   ```

3. **Ask Cursor to generate tests:**
   ```
   Based on the CarCard component, generate Vitest unit tests 
   following the patterns in .cursorrules
   ```

### With Claude Code

1. **Reference CLAUDE.md explicitly:**
   ```
   According to CLAUDE.md, implement server-side authentication 
   for the seller dashboard
   ```

2. **Use multi-step approach:**
   ```
   Step 1: Read 05-DATABASE-SCHEMA.md and create the cars table migration
   Step 2: Generate TypeScript types
   Step 3: Create the API route following 03-FEATURES-CORE.md
   ```

3. **Ask for architecture advice:**
   ```
   Given the patterns in CLAUDE.md, should I use a Server Component 
   or Client Component for the car search page?
   ```

---

## 📋 Feature Implementation Checklist

When implementing each feature, follow this checklist:

### Before Coding
- [ ] Read the feature spec in `03-FEATURES-CORE.md` or `04-FEATURES-AI.md`
- [ ] Check database schema in `05-DATABASE-SCHEMA.md`
- [ ] Review technical patterns in `CLAUDE.md`
- [ ] Understand acceptance criteria

### During Development
- [ ] Follow TypeScript patterns from `.cursorrules`
- [ ] Use proper Supabase client (server vs client)
- [ ] Implement error handling
- [ ] Add loading states
- [ ] Ensure mobile responsiveness
- [ ] Test with different user roles

### After Implementation
- [ ] Write unit tests
- [ ] Test edge cases
- [ ] Update documentation if behavior changed
- [ ] Run linter and type checker
- [ ] Create PR with reference to PRD section

---

## 🔧 Common AI Prompts

### Authentication
```
"Implement AUTH-01 from 03-FEATURES-CORE.md with Supabase email auth, 
including the trigger for auto-profile creation"
```

### Database Queries
```
"Using the schema from 05-DATABASE-SCHEMA.md, write a Supabase query 
to fetch cars with seller profiles, applying proper RLS policies"
```

### AI Features
```
"Following the AI-01 pattern in 04-FEATURES-AI.md, create the API 
route for AI description generation with Gemini"
```

### Components
```
"Create a CarCard component following the patterns in CLAUDE.md, 
with TypeScript interfaces and Tailwind styling per .cursorrules"
```

### Forms
```
"Build the car listing form from SELL-02 in 03-FEATURES-CORE.md 
with Zod validation and React Hook Form"
```

---

## 📚 Document Reference Guide

### Need to...? → Check this document:

| Task | Document |
|------|----------|
| Understand project overview | PRD.md |
| Set up development environment | 02-TECHNICAL-STACK.md |
| Implement user authentication | 03-FEATURES-CORE.md (AUTH section) |
| Build car listing features | 03-FEATURES-CORE.md (LIST, SELL sections) |
| Add search and filtering | 03-FEATURES-CORE.md (DISC section) |
| Integrate Gemini AI | 04-FEATURES-AI.md |
| Create database tables | 05-DATABASE-SCHEMA.md |
| Write queries with RLS | 05-DATABASE-SCHEMA.md |
| Understand coding standards | CLAUDE.md |
| Configure Cursor | .cursorrules |

---

## 🎓 Best Practices

### 1. Always Start with Documentation
Before implementing a feature, read the relevant PRD section completely. The code examples provided are production-ready starting points.

### 2. Use Incremental Development
Don't try to implement everything at once. Build one feature at a time, test it, then move to the next.

### 3. Leverage AI for Boilerplate
Use AI to generate repetitive code (forms, CRUD operations, components), but always review and customize.

### 4. Maintain Type Safety
The PRD includes TypeScript examples. Follow them strictly - type safety catches bugs early.

### 5. Test as You Go
Don't wait until the end to test. Write tests alongside features, especially for complex logic.

### 6. Keep PRD Updated
If you make significant changes to features or architecture, update the PRD documents so they stay accurate.

---

## 🆘 Troubleshooting

### "Cursor isn't following the rules"
- Ensure `.cursorrules` is in project root
- Try restarting Cursor
- Reference rules explicitly: "According to .cursorrules..."

### "Claude Code can't find CLAUDE.md"
- Confirm `CLAUDE.md` is in project root (not in subdirectory)
- Try: `/clear` then restart conversation

### "AI-generated code has errors"
- AI isn't perfect - review all generated code
- Check against PRD examples for correct patterns
- Validate types with TypeScript compiler

### "Database RLS policies aren't working"
- Check `05-DATABASE-SCHEMA.md` for policy examples
- Test queries in Supabase SQL editor
- Verify user authentication before queries

---

## 📞 Support

**Project Owner:** Sam (CEO, SK AutoSphere)

**For Questions About:**
- PRD Documentation: Reference this README
- Technical Implementation: Check CLAUDE.md
- Business Requirements: See PRD.md
- Database Schema: Review 05-DATABASE-SCHEMA.md

---

## 🎉 Ready to Build!

You now have everything you need to build SK AutoSphere with AI assistance:

1. ✅ Comprehensive PRD with implementation details
2. ✅ Complete database schema with migrations
3. ✅ AI integration patterns and examples
4. ✅ Coding standards and best practices
5. ✅ AI tool configuration (Cursor + Claude Code)

**Next Steps:**
1. Set up your Next.js project
2. Configure Supabase
3. Copy CLAUDE.md or .cursorrules to project root
4. Start building with AI assistance!

**Happy coding! 🚀**
