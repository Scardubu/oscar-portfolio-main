# Blog Publishing Guide

## Quick Start: Publish a New Post in 5 Minutes

### Method 1: Interactive CLI (Recommended)

```bash
npm run new-post
```

Follow the prompts, then edit the generated file.

### Method 2: Manual Creation

1. **Copy template:**
   ```bash
   cp content/blog/_TEMPLATE.mdx content/blog/your-post-slug.mdx
   ```

2. **Edit frontmatter:** Update title, date, category, tags, excerpt

3. **Write content:** Use Markdown/MDX syntax

4. **Preview locally:**
   ```bash
   npm run dev
   # Visit http://localhost:3000/blog/your-post-slug
   ```

5. **Publish:**
   ```bash
   git add content/blog/your-post-slug.mdx
   git commit -m "Add blog: Your Post Title"
   git push origin main
   ```

Vercel auto-deploys in ~2 minutes. Check https://scardubu.dev/blog

---

## Frontmatter Reference

```yaml
---
title: "Your Post Title"           # Required
publishedAt: "2024-12-08"          # Required (YYYY-MM-DD)
readTime: "10 min"                 # Required
category: "production-ml"          # Required (see categories below)
tags: ["python", "fastapi", "ml"]  # Required (array of strings)
excerpt: "Brief description"       # Required (1-2 sentences)
featured: false                    # Optional (true = show on homepage)
---
```

### Available Categories

| Category Key     | Display Name              |
|------------------|---------------------------|
| `production-ml`  | Production ML Systems     |
| `mlops`          | MLOps & Infrastructure    |
| `ai-nigeria`     | AI in Nigeria & Africa    |
| `full-stack-ml`  | Full-Stack ML Engineering |

### Common Tags

- `production-ml`, `mlops`, `deployment`, `monitoring`
- `fastapi`, `python`, `docker`, `kubernetes`
- `xgboost`, `ensemble`, `deep-learning`
- `nigeria`, `africa`, `startups`

---

## Content Best Practices

### Structure

1. **Hook (1 para):** Problem/question that grabs attention
2. **Context (2-3 paras):** Why this matters, who it's for
3. **Main Content (sections):** Step-by-step with code examples
4. **Conclusion:** Key takeaways + CTA

### Code Blocks

Use syntax highlighting:

````markdown
```python
import xgboost as xgb
model = xgb.XGBClassifier()
```
````

### Images

Place in `public/blog/[post-slug]/`:

```markdown
![Alt text](/blog/your-post-slug/diagram.png)
```

### Internal Links

```markdown
[Related Post](/blog/ensemble-models-production)
```

---

## Deployment Checklist

- [ ] Frontmatter complete and valid
- [ ] Excerpt compelling (shows in previews)
- [ ] Code blocks tested and formatted
- [ ] Images optimized (<200KB each)
- [ ] Internal links working
- [ ] Preview looks good locally
- [ ] Commit message descriptive
- [ ] Pushed to main branch

---

## Troubleshooting

### Post not showing?

1. Check frontmatter syntax (valid YAML)
2. Ensure `publishedAt` is today or earlier
3. Clear Next.js cache: `rm -rf .next && npm run dev`

### Build failing?

1. Check Vercel dashboard for errors
2. Validate MDX syntax: https://mdxjs.com/playground/

### Images not loading?

1. Verify path: `/blog/[slug]/image.png`
2. Check file exists in `public/blog/[slug]/`

---

## Advanced: Schedule Posts

1. Set future `publishedAt` date
2. Commit to separate branch
3. Merge to main on publish day
4. Or use GitHub Actions for automated scheduling

---

## Maintenance

**Weekly:**
- Review live metrics accuracy
- Check GitHub API rate limits
- Update blog posts as needed

**Monthly:**
- Update patterns array in ProductionPatternsVisualization
- Refresh live metrics mock data with real DB queries
- Review analytics for feature performance

**Quarterly:**
- Audit blog post quality
- Update reading time estimates
- Refresh related post algorithms
