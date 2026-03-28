#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function createBlogPost() {
  console.log('\n📝 Create New Blog Post\n');

  const title = await question('Post Title: ');
  const category = await question('Category (production-ml/mlops/ai-nigeria/full-stack-ml): ');
  const readTime = await question('Estimated Read Time (e.g., "10 min"): ');
  const tags = await question('Tags (comma-separated, e.g., "fastapi,python,ml"): ');

  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const today = new Date().toISOString().split('T')[0];

  const frontmatter = `---
title: "${title}"
publishedAt: "${today}"
readTime: "${readTime || '10 min'}"
category: "${category || 'production-ml'}"
tags: [${tags
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
    .map((t) => `"${t}"`)
    .join(', ')}]
excerpt: "Add a compelling 1-2 sentence excerpt here"
featured: false
---

# ${title}

Start writing your blog post content here...

## Introduction

Hook your readers with a clear problem or question.

## Main Content

Add your sections, code examples, and insights.

## Conclusion

Wrap up with key takeaways and a next step.
`;

  const filePath = path.join(process.cwd(), 'content', 'blog', `${slug}.mdx`);

  try {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    if (fs.existsSync(filePath)) {
      console.log(`\n❌ Error: File already exists at ${filePath}`);
      rl.close();
      return;
    }

    fs.writeFileSync(filePath, frontmatter, 'utf8');

    console.log(`\n✅ Blog post created successfully!`);
    console.log(`📁 Location: ${filePath}`);
    console.log(`🔗 URL will be: /blog/${slug}`);
    console.log(`\nNext steps:`);
    console.log(` 1. Edit the file: code ${filePath}`);
    console.log(` 2. Add your content`);
    console.log(` 3. Commit and push: git add . && git commit -m "Add blog: ${title}" && git push`);
    console.log(` 4. Vercel will auto-deploy in ~2 minutes\n`);
  } catch (error) {
    console.error('❌ Failed to create blog post:', error);
  } finally {
    rl.close();
  }
}

createBlogPost().catch((error) => {
  console.error(error);
  rl.close();
});
