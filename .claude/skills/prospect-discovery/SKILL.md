# Prospect Discovery Skill

This skill automates the discovery of prospects and creation of demo showcase sites for Evelyn Learning.

## When to Use

Trigger this skill when:
- User says "find prospects", "discover prospects", "prospect for leads"
- User says "fill the queue", "refill drafts", "create more demos"
- User wants to run the prospecting automation

## Workflow

### 1. Check Current Queue Status

First, fetch the prospecting config to understand:
- What is the seed concept?
- What is the max drafts limit?
- How many drafts currently exist?
- Is prospecting enabled?

```bash
curl -s http://localhost:3006/api/admin/prospecting | jq
```

Also check how many drafts exist:
```bash
curl -s "http://localhost:3006/api/showcase?status=draft" | jq '.sites | length'
```

### 2. Calculate How Many Prospects to Find

```
needed = maxDrafts - currentDraftCount
```

If needed <= 0, inform the user the queue is full.

### 3. Search for Prospects

Using the seed concept, search the web for matching businesses. For example:
- Seed: "Test prep centers in Boston area"
- Search: "test prep tutoring centers Boston Massachusetts"

Use WebSearch to find businesses. Look for:
- Business websites (not directories like Yelp)
- Educational businesses (tutoring, test prep, college consulting)
- Businesses with contact information available

### 4. For Each Prospect Found

a) **Visit their website** using Claude in Chrome:
   - Navigate to their homepage
   - Read the page to extract:
     - Business name
     - Services offered
     - Contact email
     - Contact phone
     - Address
     - Contact form URL (usually /contact)
     - About page content
     - Team info
     - Testimonials

b) **Check if already exists**:
   ```bash
   curl -s "http://localhost:3006/api/showcase?originalWebsiteUrl=<url>"
   ```

c) **Add to candidates queue**:
   ```bash
   curl -X POST http://localhost:3006/api/admin/prospecting/candidates \
     -H "Content-Type: application/json" \
     -d '{
       "businessName": "...",
       "websiteUrl": "...",
       "location": "...",
       "contactEmail": "...",
       "contactPhone": "...",
       "contactFormUrl": "..."
     }'
   ```

d) **Create the demo site**:
   - Scrape comprehensive content from their website
   - Generate multi-page showcase site with:
     - Home page with hero, stats, services
     - About page
     - Programs/Services pages
     - Team page (if they have one)
     - Contact page
     - Appropriate branding colors

   Use the showcase creation API:
   ```bash
   curl -X POST http://localhost:3006/api/showcase \
     -H "Content-Type: application/json" \
     -d '{
       "businessName": "...",
       "businessType": "test-prep|tutoring|college-consulting",
       "originalWebsiteUrl": "...",
       "status": "draft",
       ...
     }'
   ```

e) **Update candidate status** to "demo_created" and link the showcase slug

### 5. Handle Pending Contact Forms

After demos are activated and emails are sent, check for pending contact forms:

```bash
curl -s http://localhost:3006/api/admin/prospecting/pending-forms | jq
```

For each pending form:
1. Navigate to the contact form URL
2. Fill the form with the template message
3. Submit
4. Mark as complete:
   ```bash
   curl -X POST http://localhost:3006/api/admin/prospecting/pending-forms \
     -H "Content-Type: application/json" \
     -d '{"slug": "...", "notes": "Contact form submitted"}'
   ```

## Quality Guidelines

When creating demo sites:
- Match their branding colors (extract from their website)
- Use their actual testimonials if available
- Include real services they offer
- Use appropriate imagery placeholders
- Ensure contact info is accurate

## Using "Needs Review" Status

When encountering a prospect that requires clarification before finalizing:

### When to use needs_review:
- Business type is unclear or doesn't fit existing categories
- Website has unusual structure that needs special handling
- Missing critical information (no contact, no services listed)
- Potential duplicate or similar to existing prospect
- Any situation where you need user guidance

### Create with needs_review status:
```bash
curl -X POST http://localhost:3006/api/admin/prospecting/generate-demo \
  -H "Content-Type: application/json" \
  -d '{
    "businessName": "Example Academy",
    "websiteUrl": "https://example.com",
    "businessType": "tutoring",
    "status": "needs_review",
    "reviewNotes": "Question: This business offers both test prep and college consulting. Which category should this be? Also, could not find contact email on their site."
  }'
```

### Good review notes include:
- Specific questions that need answers
- What information is missing
- What decision needs to be made
- Any observations about the prospect

## Error Handling

- If a website is unreachable, skip and note in candidates
- If a demo creation fails, mark candidate as "failed" with error
- Always maintain the max drafts limit
- Use "needs_review" status when uncertain rather than skipping

## Reporting

After prospecting, report:
- How many new prospects discovered
- How many demos created
- Current queue status
- Any errors encountered
