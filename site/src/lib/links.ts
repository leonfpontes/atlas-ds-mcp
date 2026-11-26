// Every link the site uses, in one place. GitHub links answer 404 until the repository is
// public (story B3 publishes it); see the F2 card.
export const REPO = 'https://github.com/leonfpontes/atlas-ds-mcp'
export const LINKS = {
  repo: REPO,
  changelog: `${REPO}/blob/main/CHANGELOG.md`,
  methodology: `${REPO}/blob/main/evals/README.md`,
  issues: `${REPO}/issues/new`,
  ownerGithub: 'https://github.com/leonfpontes',
  linkedin: 'https://www.linkedin.com/in/leonardo-fonseca-pontes-465740103/',
  // The Storybook ships with the site under /storybook/ (vite.config.ts).
  docs: '/storybook/',
  doc: (id: string) => `/storybook/?path=/docs/${id}`,
} as const
