export const selectors = {
  title: [
    'h1',
    '[data-testid*="title"]',
    '.job-title',
    '.position-title',
    '[class*="jobtitle"]',
    '.top-card-layout__title',
    '.jobsearch-JobInfoHeader-title',
    '[data-test="job-title"]'
  ],
  description: [
    '[data-testid*="description"]',
    '.job-description',
    '#job-description',
    '[class*="description"]',
    'article',
    '.description__text',
    '#jobDescriptionText',
    '[data-test="description"]'
  ],
  company: [
    '[data-testid*="company"]',
    '.company-name',
    '[class*="company"]',
    '[itemprop="hiringOrganization"]',
    '.top-card-layout__company',
    '.jobsearch-InlineCompanyRating',
    '[data-test="employer-name"]'
  ]
};