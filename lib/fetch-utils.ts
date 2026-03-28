// lib/fetch-utils.ts - Consistent fetch caching utilities

/**
 * Fetch with Next.js caching support
 * Uses ISR (Incremental Static Regeneration) for optimal performance
 */
export async function fetchWithCache<T>(
  url: string,
  options: {
    revalidate?: number
    tags?: string[]
  } = {}
): Promise<T> {
  const { revalidate = 3600, tags = [] } = options

  try {
    const response = await fetch(url, {
      next: {
        revalidate,
        tags,
      },
      cache: 'force-cache',
    })

    if (!response.ok) {
      throw new Error(`Fetch failed: ${response.status} ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    console.error(`Fetch error for ${url}:`, error)
    throw error
  }
}

/**
 * Fetch with no caching - for real-time data
 */
export async function fetchNoCache<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error(`Fetch failed: ${response.status}`)
  }

  return response.json()
}

/**
 * Fetch with short cache - for frequently updated data
 */
export async function fetchShortCache<T>(
  url: string,
  revalidateSeconds: number = 60
): Promise<T> {
  return fetchWithCache<T>(url, { revalidate: revalidateSeconds })
}

/**
 * Fetch with long cache - for rarely changing data
 */
export async function fetchLongCache<T>(
  url: string,
  revalidateSeconds: number = 86400
): Promise<T> {
  return fetchWithCache<T>(url, { revalidate: revalidateSeconds })
}

// Type for GitHub stats response
export interface GitHubStats {
  totalStars: number
  publicRepos: number
  followers: number
}

/**
 * Get GitHub stats with caching
 */
export async function getGitHubStats(username: string): Promise<GitHubStats | null> {
  try {
    const [userResponse, reposResponse] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, {
        next: { revalidate: 86400, tags: ['github-user'] },
        headers: {
          Accept: 'application/vnd.github.v3+json',
        },
      }),
      fetch(`https://api.github.com/users/${username}/repos?per_page=100`, {
        next: { revalidate: 86400, tags: ['github-repos'] },
        headers: {
          Accept: 'application/vnd.github.v3+json',
        },
      }),
    ])

    if (!userResponse.ok || !reposResponse.ok) {
      return null
    }

    const user = await userResponse.json()
    const repos = await reposResponse.json()

    return {
      totalStars: repos.reduce((sum: number, repo: { stargazers_count: number }) => 
        sum + repo.stargazers_count, 0),
      publicRepos: user.public_repos,
      followers: user.followers,
    }
  } catch (error) {
    console.error('GitHub stats fetch error:', error)
    return null
  }
}
