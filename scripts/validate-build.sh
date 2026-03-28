#!/bin/bash

echo "🔍 Validating build..."

# Check blog directory
if [ ! -d "content/blog" ]; then
  echo "❌ Error: content/blog directory not found"
  exit 1
fi

POST_COUNT=$(find content/blog -name "*.mdx" -o -name "*.md" | wc -l)
echo "✅ Found $POST_COUNT blog posts"

# Check components
COMPONENTS=(
  "components/BlogProgressWidget.tsx"
  "components/ProductionPatternsVisualization.tsx"
  "components/LiveBuildFeed.tsx"
  "components/ContinueReadingBanner.tsx"
  "components/BlogReadingProgressTracker.tsx"
)

for component in "${COMPONENTS[@]}"; do
  if [ -f "$component" ]; then
    echo "✅ $component exists"
  else
    echo "❌ Missing: $component"
    exit 1
  fi
done

# Check API routes
API_ROUTES=(
  "app/api/recent-blog-posts/route.ts"
  "app/api/live-metrics/route.ts"
)

for route in "${API_ROUTES[@]}"; do
  if [ -f "$route" ]; then
    echo "✅ $route exists"
  else
    echo "❌ Missing: $route"
    exit 1
  fi
done

echo "✅ Build validation complete!"
