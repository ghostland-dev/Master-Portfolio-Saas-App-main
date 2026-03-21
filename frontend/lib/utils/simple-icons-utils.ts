/**
 * Utility functions for working with Simple Icons
 * https://simpleicons.org/
 */

// Base URL for Simple Icons CDN
const SIMPLE_ICONS_CDN = "https://cdn.simpleicons.org"

/**
 * Get the URL for a Simple Icon by slug
 * @param slug The slug of the icon (lowercase, no spaces)
 * @returns The URL to the SVG icon
 */
export function getSimpleIconUrl(slug: string): string {
  return `${SIMPLE_ICONS_CDN}/${slug}.svg`
}

/**
 * Technology icon mapping
 * Maps technology names to their Simple Icons slugs
 */
export const technologyIcons: Record<string, string> = {
  // Frontend
  React: "react",
  "Vue.js": "vuedotjs",
  "Next.js": "nextdotjs",
  "Nuxt.js": "nuxtdotjs",
  Angular: "angular",
  Svelte: "svelte",
  JavaScript: "javascript",
  TypeScript: "typescript",
  HTML5: "html5",
  CSS3: "css3",
  "Tailwind CSS": "tailwindcss",
  "Material UI": "mui",
  Bootstrap: "bootstrap",
  "Styled Components": "styledcomponents",
  "Framer Motion": "framer",
  Redux: "redux",
  Webpack: "webpack",
  Vite: "vite",

  // Backend
  "Node.js": "nodedotjs",
  Express: "express",
  NestJS: "nestjs",
  Django: "django",
  Flask: "flask",
  Laravel: "laravel",
  "Spring Boot": "springboot",
  "Ruby on Rails": "rubyonrails",
  GraphQL: "graphql",
  "REST API": "openapiinitiative",
  JWT: "jsonwebtokens",
  "Socket.IO": "socketdotio",
  Swagger: "swagger",
  Prisma: "prisma",

  // DevOps
  Docker: "docker",
  Kubernetes: "kubernetes",
  "GitHub Actions": "githubactions",
  Jenkins: "jenkins",
  AWS: "amazonaws",
  "Google Cloud": "googlecloud",
  Azure: "microsoftazure",
  Terraform: "terraform",
  Ansible: "ansible",
  Prometheus: "prometheus",
  Grafana: "grafana",
  CircleCI: "circleci",
  "Travis CI": "travisci",

  // Databases
  PostgreSQL: "postgresql",
  MySQL: "mysql",
  MariaDB: "mariadb",
  "SQL Server": "microsoftsqlserver",
  MongoDB: "mongodb",
  Redis: "redis",
  Elasticsearch: "elasticsearch",
  Firebase: "firebase",
  Supabase: "supabase",
  DynamoDB: "amazondynamodb",
  Cassandra: "apachecassandra",

  // Languages
  Python: "python",
  Java: "java",
  "C#": "csharp",
  PHP: "php",
  PHPUnit: "phpunit",
  "ASP.NET Core": "dotnet",
  Go: "go",
  Rust: "rust",
  Ruby: "ruby",
  Kotlin: "kotlin",
  Swift: "swift",

  // Tools
  Git: "git",
  GitHub: "github",
  GitLab: "gitlab",
  Bitbucket: "bitbucket",
  "VS Code": "visualstudiocode",
  Figma: "figma",
  "Adobe XD": "adobexd",
  Sketch: "sketch",
  Postman: "postman",
  Jira: "jira",
  Notion: "notion",

  // AI/ML
  TensorFlow: "tensorflow",
  PyTorch: "pytorch",
  "scikit-learn": "scikitlearn",
  OpenAI: "openai",
  "Hugging Face": "huggingface",

  // Mobile
  "React Native": "react",
  Flutter: "flutter",
  Ionic: "ionic",
  Xamarin: "xamarin",

  // Testing
  Jest: "jest",
  Mocha: "mocha",
  Cypress: "cypress",
  Selenium: "selenium",
  Playwright: "playwright",

  // Analytics
  "Google Analytics": "googleanalytics",
  Mixpanel: "mixpanel",
  Amplitude: "amplitude",

  // Other
  Vercel: "vercel",
  Netlify: "netlify",
  Heroku: "heroku",
  "Digital Ocean": "digitalocean",
  Cloudflare: "cloudflare",
  Stripe: "stripe",
  Auth0: "auth0",
  Storybook: "storybook",
}

/** Normalized keys (lowercase, no spaces) → Simple Icons slug */
const technologySlugAliases: Record<string, string> = {
  react: "react",
  nextjs: "nextdotjs",
  next: "nextdotjs",
  nodejs: "nodedotjs",
  node: "nodedotjs",
  vue: "vuedotjs",
  angular: "angular",
  golang: "go",
  go: "go",
  postgresql: "postgresql",
  postgres: "postgresql",
  mongodb: "mongodb",
  mongo: "mongodb",
  redis: "redis",
  docker: "docker",
  kubernetes: "kubernetes",
  k8s: "kubernetes",
  python: "python",
  java: "java",
  swift: "swift",
  kotlin: "kotlin",
  flutter: "flutter",
  "react-native": "react",
  reactnative: "react",
  typescript: "typescript",
  javascript: "javascript",
  postman: "postman",
  figma: "figma",
  vercel: "vercel",
  aws: "amazonaws",
  elasticsearch: "elasticsearch",
  csharp: "csharp",
  php: "php",
  phpunit: "phpunit",
  aspnetcore: "dotnet",
  jenkins: "jenkins",
  nginx: "nginx",
  linux: "linux",
  html5: "html5",
  css3: "css3",
  bootstrap: "bootstrap",
  mocha: "mocha",
  cypress: "cypress",
  playwright: "playwright",
  selenium: "selenium",
  junit: "junit",
  pytest: "pytest",
  stripe: "stripe",
}

/** Prefer these local `/public/images/tech/*.svg` basenames before CDN */
const localTechIconTries: Record<string, string[]> = {
  react: ["react", "React"],
  nextjs: ["nextjs", "next.js", "Next.js"],
  docker: ["docker", "Docker"],
  kubernetes: ["kubernetes", "Kubernetes"],
  vue: ["vue", "Vue.js", "vue.js"],
  mongodb: ["mongodb", "MongoDB"],
  redis: ["redis", "Redis"],
  mysql: ["mysql", "MySQL"],
  postgresql: ["postgresql"],
  python: ["python", "Python"],
  java: ["java", "Java"],
  go: ["go", "Go"],
  rust: ["rust", "Rust"],
  git: ["git", "Git"],
  github: ["github", "GitHub"],
  figma: ["figma", "Figma"],
  tailwind: ["tailwind", "Tailwind CSS"],
  prisma: ["prisma", "Prisma"],
  graphql: ["graphql", "GraphQL"],
  jest: ["jest", "Jest"],
  nginx: ["nginx"],
}

function normalizeTechKey(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/#/g, "sharp")
    .replace(/\./g, "")
    .replace(/[^a-z0-9]+/g, "")
}

/**
 * Resolve Simple Icons slug from a tech label or short id (e.g. nextjs, Node.js).
 */
export function resolveTechnologyIconSlug(raw: string): string | undefined {
  const t = raw.trim()
  if (!t) return undefined

  if (technologyIcons[t]) return technologyIcons[t]

  const lower = t.toLowerCase()
  if (technologySlugAliases[lower]) return technologySlugAliases[lower]

  const compact = normalizeTechKey(t)
  if (technologySlugAliases[compact]) return technologySlugAliases[compact]

  const ciMatch = Object.keys(technologyIcons).find((k) => k.toLowerCase() === lower)
  if (ciMatch) return technologyIcons[ciMatch]

  return undefined
}

/**
 * Ordered image URLs: local SVG attempts first, then Simple Icons CDN.
 */
export function getTechIconCandidateUrls(label: string): string[] {
  const raw = label.trim()
  if (!raw) return []

  const urls: string[] = []
  const seen = new Set<string>()
  const push = (u: string) => {
    if (!seen.has(u)) {
      seen.add(u)
      urls.push(u)
    }
  }

  const key = raw.toLowerCase()
  const tries = localTechIconTries[key] || localTechIconTries[normalizeTechKey(raw)]
  if (tries) {
    for (const base of tries) {
      push(`/images/tech/${base}.svg`)
    }
  }

  const slug = resolveTechnologyIconSlug(raw)
  if (!tries) {
    push(`/images/tech/${key.replace(/\s+/g, "-")}.svg`)
    push(`/images/tech/${key.replace(/\s+/g, "")}.svg`)
  }

  if (slug) {
    push(`${SIMPLE_ICONS_CDN}/${slug}`)
  }

  return urls
}

/**
 * Get the Simple Icon slug for a technology
 * @param technology The technology name
 * @returns The slug for the technology icon or undefined if not found
 */
export function getTechnologyIconSlug(technology: string): string | undefined {
  return technologyIcons[technology] ?? resolveTechnologyIconSlug(technology)
}

/**
 * Get the Simple Icon URL for a technology
 * @param technology The technology name
 * @returns The URL to the SVG icon or undefined if not found
 */
export function getTechnologyIconUrl(technology: string): string | undefined {
  const slug = getTechnologyIconSlug(technology)
  if (!slug) return undefined
  return getSimpleIconUrl(slug)
}
