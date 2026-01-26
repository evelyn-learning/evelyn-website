# Claude Code Implementation Guide
## Evelyn Learning Website Transformation

This document contains step-by-step prompts and instructions for Claude Code to implement the website transformation from content development focus to AI-first positioning.

---

## PHASE 1: Project Setup & File Structure

### Prompt 1.1: Understand Current Structure
```
First, help me understand my current Next.js project structure. List all the files and folders, especially:
- The pages/app directory structure
- Components folder
- Any existing API routes
- Current styling setup (Tailwind config, global CSS)
```

### Prompt 1.2: Create New Folder Structure
```
Create the following folder structure for my Next.js app (using app router if available, otherwise pages router):

/app (or /pages)
  /products
    page.tsx (products overview)
    /essay-ai
      page.tsx
    /homework-bot
      page.tsx  
    /test-generator
      page.tsx
    /tutor-copilot
      page.tsx
    /content-ai
      page.tsx
  /solutions
    page.tsx (solutions overview)
    /test-prep
      page.tsx
    /tutoring
      page.tsx
    /publishers
      page.tsx
    /edtech
      page.tsx
    /k12
      page.tsx
  /about
    page.tsx
  /contact
    page.tsx

/components
  /navigation
    Navigation.tsx
    MobileMenu.tsx
  /demos
    EssayScoringDemo.tsx
    HomeworkBotDemo.tsx
    PracticeTestGeneratorDemo.tsx
    TutoringCopilotDemo.tsx
  /sections
    HeroSection.tsx
    ProductsGrid.tsx
    SolutionsGrid.tsx
    CTASection.tsx
  /ui
    Button.tsx
    Card.tsx
    Badge.tsx

/lib
  /api
    claude.ts (Claude API wrapper)
```

---

## PHASE 2: Navigation Update

### Prompt 2.1: Install/Update Navigation
```
I have a new Navigation component to install. Here's the component code:

[PASTE THE FULL NAVIGATION.TSX CODE FROM THE FILE I PROVIDED]

Please:
1. Save this as /components/navigation/Navigation.tsx
2. Update my layout.tsx (or _app.tsx) to use this new navigation
3. Make sure the mobile menu works correctly
4. Ensure the dropdown menus appear on hover
```

### Prompt 2.2: Update Layout with Navigation Spacing
```
Update my main layout to:
1. Include the new Navigation component at the top
2. Add padding-top to the main content area to account for the fixed navigation (h-20 = 5rem = 80px)
3. Make sure the navigation is imported and rendered on all pages
```

---

## PHASE 3: Homepage Transformation

### Prompt 3.1: Replace Homepage
```
I need to completely replace my homepage with a new AI-first design. Here's the new homepage component:

[PASTE THE FULL HOMEPAGE.TSX CODE FROM THE FILE I PROVIDED]

Please:
1. Replace the existing homepage (app/page.tsx or pages/index.tsx)
2. Make sure all Link imports are correct for my Next.js version
3. Verify the styling works with my Tailwind setup
4. Test that all the sections render correctly
```

### Prompt 3.2: Add Homepage Animations
```
Add subtle animations to the homepage:
1. Fade-in on scroll for sections
2. Smooth hover transitions on cards
3. The floating background elements should have gentle movement

Use CSS animations or Framer Motion if it's already installed.
```

---

## PHASE 4: AI Products Pages

### Prompt 4.1: Create Products Overview Page
```
Create the products overview page. Here's the component:

[PASTE THE FULL PRODUCTS.TSX CODE FROM THE FILE I PROVIDED]

Save this as app/products/page.tsx and ensure:
1. All product cards link to their individual pages
2. The comparison table is responsive
3. CTAs link to contact page with product parameter
```

### Prompt 4.2: Create Individual Product Pages
```
Create the individual product pages. I'll provide the essay-ai page as a template:

[PASTE THE FULL PRODUCT-ESSAY-AI.TSX CODE FROM THE FILE I PROVIDED]

Use this as a template to create:
1. /products/essay-ai/page.tsx (use provided code)
2. /products/homework-bot/page.tsx (adapt with homework bot content)
3. /products/test-generator/page.tsx (adapt with test generator content)
4. /products/tutor-copilot/page.tsx (adapt with copilot content)
5. /products/content-ai/page.tsx (adapt with content AI info - no live demo)

For each page, change:
- The hero content (title, description, icon, colors)
- The metrics section
- The features list
- The use cases
- The related products at bottom
```

---

## PHASE 5: Demo Components

### Prompt 5.1: Install Demo Components
```
I have React demo components for our AI products. These need to call the Claude API.

First, create a Claude API wrapper at /lib/api/claude.ts:

import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function callClaude(messages: any[], systemPrompt: string, maxTokens = 1500) {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: maxTokens,
    system: systemPrompt,
    messages
  });
  
  return response.content[0].text;
}

Now, create an API route at /app/api/claude/route.ts (or /pages/api/claude.ts) that the frontend can call:

[Create secure API route that proxies Claude requests]
```

### Prompt 5.2: Essay Scoring Demo Component
```
Here's the Essay Scoring Demo component:

[PASTE THE FULL ESSAY-SCORER-DEMO.JSX CODE FROM THE PREVIOUSLY PROVIDED FILES]

Please:
1. Save as /components/demos/EssayScoringDemo.tsx
2. Convert to TypeScript if needed
3. Modify to call our API route (/api/claude) instead of directly calling Claude
4. Make sure it handles loading and error states
5. Test that the demo works end-to-end
```

### Prompt 5.3: Homework Bot Demo Component
```
Here's the Homework Bot Demo component:

[PASTE THE FULL HOMEWORK-BOT-DEMO.JSX CODE]

Same instructions as above - save as /components/demos/HomeworkBotDemo.tsx
```

### Prompt 5.4: Practice Test Generator Demo
```
Here's the Practice Test Generator Demo:

[PASTE THE FULL PRACTICE-TEST-GENERATOR-DEMO.JSX CODE]

Save as /components/demos/PracticeTestGeneratorDemo.tsx
```

### Prompt 5.5: Tutoring Co-Pilot Demo
```
Here's the Tutoring Co-Pilot Demo:

[PASTE THE FULL TUTORING-COPILOT-DEMO.JSX CODE]

Save as /components/demos/TutoringCopilotDemo.tsx
```

---

## PHASE 6: Solutions Pages

### Prompt 6.1: Create Solutions Overview Page
```
Create a Solutions overview page at /app/solutions/page.tsx that:
1. Has a hero section explaining we have solutions for different business types
2. Shows cards for each solution type (Test Prep, Tutoring, Publishers, EdTech, K-12)
3. Each card links to its detailed page
4. Uses the same visual style as our products page

Use this content for the cards:
- Test Prep Companies: "Scale your test prep with AI. Unlimited practice tests, instant essay scoring, 24/7 student support."
- Tutoring Businesses: "Multiply your tutors' impact. AI co-pilots, homework bots, and automated session summaries."
- Publishers: "Transform content into AI experiences. Generate assessments, create adaptive learning paths."
- EdTech Platforms: "Add AI to your platform. White-label products, APIs, custom integration."
- K-12 Schools: "Bring AI to your classrooms. Teacher assistants, student support, writing feedback."
```

### Prompt 6.2: Create Test Prep Solution Page
```
Create /app/solutions/test-prep/page.tsx with:

Hero:
- Title: "AI Solutions for Test Prep Companies"
- Subtitle: "Scale your business with intelligent tools that prepare students better and operate more efficiently."

Sections:
1. Pain Points We Solve:
   - Limited practice test inventory
   - Essay grading bottleneck
   - No after-hours support
   - Inconsistent tutor quality

2. Our Solutions for You:
   - Practice Test Generator (link to product)
   - Essay Scoring (link to product)
   - 24/7 Homework Bot (link to product)
   - Tutoring Co-Pilot (link to product)

3. Results:
   - "150+ point average SAT improvement"
   - "80% reduction in essay grading time"
   - "40% improvement in student retention"

4. Case Study Teaser (placeholder for now)

5. CTA: "Book a Test Prep Demo"
```

### Prompt 6.3: Create Other Solution Pages
```
Create similar pages for:
- /solutions/tutoring
- /solutions/publishers
- /solutions/edtech
- /solutions/k12

Each should follow the same structure but with content relevant to that audience. I'll provide specific content if needed, or use AI to generate appropriate content based on the pattern.
```

---

## PHASE 7: Contact Page Update

### Prompt 7.1: Update Contact Page
```
Update the contact page to:
1. Handle URL parameters (?demo=true, ?product=essay-ai, etc.)
2. Pre-fill the form based on which product/demo they came from
3. Add a section about what to expect in a demo
4. Include multiple contact options (form, email, phone, calendar booking)

Add a demo-focused variation when ?demo=true:
- Title: "Book Your Personalized Demo"
- Subtitle: "See our AI products working with your content. 30 minutes, no commitment."
- Show what's included in the demo
```

---

## PHASE 8: About Page Update

### Prompt 8.1: Reframe About Page
```
Update the About page to lead with AI capabilities while honoring our content expertise heritage.

New structure:
1. Hero: "We Started as Educators. We Became AI Innovators."
2. Our Story: How content expertise led to AI
3. The Team: Highlight technical + educational leadership
4. Our Approach: "AI trained by teachers, not just engineers"
5. By the Numbers: Stats reframed for AI (content items in training data, etc.)
6. Timeline: Company milestones including AI pivot
7. CTA: "Partner with Us"
```

---

## PHASE 9: Environment & Deployment

### Prompt 9.1: Environment Variables
```
Help me set up environment variables for:
1. ANTHROPIC_API_KEY (for Claude API)
2. Any other API keys needed

Create a .env.example file with:
ANTHROPIC_API_KEY=your_api_key_here

And make sure .env is in .gitignore.
```

### Prompt 9.2: API Rate Limiting
```
Add rate limiting to the /api/claude endpoint to prevent abuse:
1. Limit to 10 requests per minute per IP for demos
2. Return appropriate error messages when limited
3. Log excessive usage for monitoring
```

### Prompt 9.3: Production Deployment Check
```
Before deploying to production, help me verify:
1. All environment variables are set on Contabo
2. Build completes without errors
3. API routes are working
4. Demo components load correctly
5. All links work
6. Mobile responsiveness is good
7. Performance is acceptable (Lighthouse check)
```

---

## PHASE 10: SEO & Final Polish

### Prompt 10.1: Add Metadata
```
Add proper metadata to all pages for SEO:
1. Page titles following pattern: "[Page Name] | Evelyn Learning - AI for Education"
2. Meta descriptions for each page
3. Open Graph tags for social sharing
4. Structured data where appropriate

Priority pages:
- Homepage
- Products overview
- Each product page
- Solutions pages
```

### Prompt 10.2: Create Sitemap
```
Generate a sitemap.xml that includes all the new pages:
- Homepage
- All product pages
- All solution pages
- About
- Contact
- Blog (existing)
```

### Prompt 10.3: Analytics Setup
```
Ensure analytics tracking is set up for:
1. Page views on all new pages
2. CTA button clicks
3. Demo starts and completions
4. Contact form submissions
5. Product page engagement
```

---

## Quick Reference: File Mapping

| What | File Location |
|------|---------------|
| Homepage | app/page.tsx |
| Navigation | components/navigation/Navigation.tsx |
| Products Overview | app/products/page.tsx |
| Essay AI Product | app/products/essay-ai/page.tsx |
| Essay Demo | components/demos/EssayScoringDemo.tsx |
| Homework Bot Demo | components/demos/HomeworkBotDemo.tsx |
| Test Generator Demo | components/demos/PracticeTestGeneratorDemo.tsx |
| Co-Pilot Demo | components/demos/TutoringCopilotDemo.tsx |
| Claude API Route | app/api/claude/route.ts |
| Solutions Overview | app/solutions/page.tsx |
| Contact | app/contact/page.tsx |
| About | app/about/page.tsx |

---

## Troubleshooting Common Issues

### "Module not found" errors
```
If you see module not found errors, run:
npm install

If specific packages are missing:
npm install @anthropic-ai/sdk
npm install framer-motion (if using animations)
```

### API not working
```
1. Check that ANTHROPIC_API_KEY is set in .env
2. Verify the API route is at the correct path
3. Check browser console for CORS errors
4. Test the API route directly with curl
```

### Styling issues
```
1. Verify Tailwind is configured correctly
2. Check that all color classes exist in your Tailwind config
3. Clear .next cache: rm -rf .next && npm run dev
```

### Demo not loading
```
1. Make sure demo components are client-side only (use 'use client' or dynamic import)
2. Check that API route is returning valid JSON
3. Verify Claude API key has sufficient credits
```

---

## Deployment Checklist

- [ ] All pages render without errors
- [ ] Navigation works on desktop and mobile
- [ ] All demos work end-to-end
- [ ] Contact form submits correctly
- [ ] Environment variables set on server
- [ ] Build completes successfully
- [ ] Lighthouse score acceptable (>80)
- [ ] Mobile responsive
- [ ] SEO metadata in place
- [ ] Analytics tracking working
