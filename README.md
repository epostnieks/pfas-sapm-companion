# Blog Expansion Project - Divide & Conquer

## Mission
Expand 2,508 blog post stubs from ~100 words to ~1,300 words each.
Total output: ~3.25 million words of SEO content.

---

## Assignments

| LLM | Posts | Focus Areas |
|-----|-------|-------------|
| **Claude** | 627 | US Banking Regs, BSA/AML, Examinations, State compliance |
| **GPT** | 627 | International (UK, EU, APAC), Privacy, Vendor management |
| **Grok** | 627 | Industries (crypto, healthcare, defense), Technology, RegTech |
| **Gemini** | 627 | Operations, Careers, Templates, Best practices |

---

## Workflow

### Step 1: Distribute Assignments
Each LLM gets their assignment file:
- `GPT-ASSIGNMENT.md` → ChatGPT
- `GROK-ASSIGNMENT.md` → Grok  
- `GEMINI-ASSIGNMENT.md` → Gemini
- `CLAUDE-ASSIGNMENT.md` → Claude (me)

### Step 2: Process in Batches
1. Copy 15-20 stubs from the assignment
2. Use `PROMPT-TEMPLATE.md` with the stubs
3. Request output as JavaScript array
4. Save each batch as `[LLM]-batch-[N].js`

### Step 3: Quality Check
For each batch, verify:
- [ ] Word count: 1,200-1,500 per post
- [ ] No generic filler
- [ ] Accurate regulatory citations
- [ ] Consistent tone
- [ ] Proper markdown formatting

### Step 4: Submit to Claude for QC
Send completed batches back. I will:
1. Review for quality/consistency
2. Fix any issues
3. Merge into final blog files
4. Replace stubs with expanded content

---

## Timeline Estimate

| Phase | Posts | Est. Time |
|-------|-------|-----------|
| Batch processing (parallel) | 2,508 | 4-6 hours each LLM |
| QC & editing | 2,508 | 8-12 hours |
| Final merge | - | 2-3 hours |

**Total: ~2-3 days with parallel processing**

---

## Output Format

Each LLM should return batches as:

```javascript
// GPT-batch-1.js
export const gptBatch1 = [
  {
    slug: 'uk-fca-compliance-guide',
    title: 'UK FCA Compliance: Complete Guide for Financial Institutions',
    excerpt: 'Navigate FCA requirements with confidence...',
    category: 'UK',
    vertical: 'International',
    date: 'January 2026',
    icon: '🇬🇧',
    readTime: '12 min',
    content: `[1,200-1,500 words of actual content here]`
  },
  // ... more posts
];
```

---

## Files in This Directory

```
/blog-assignments/
├── README.md (this file)
├── PROMPT-TEMPLATE.md (shared prompt for all LLMs)
├── GPT-ASSIGNMENT.md (627 posts for ChatGPT)
├── GROK-ASSIGNMENT.md (627 posts for Grok)
├── GEMINI-ASSIGNMENT.md (627 posts for Gemini)
└── CLAUDE-ASSIGNMENT.md (627 posts for Claude)
```

---

## Success Criteria

- [ ] All 2,508 posts expanded to 1,200+ words
- [ ] Total word count: 3M+ words
- [ ] Consistent voice across all posts
- [ ] Accurate regulatory citations
- [ ] Ready for SEO deployment
