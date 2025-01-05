import { selectors } from './selectors';

export function findContent(selectorList: string[]): string {
  for (const selector of selectorList) {
    const element = document.querySelector(selector);
    if (element) return element.innerText.trim();
  }
  return '';
}

export function extractStructuredData(): any {
  return Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
    .map(script => {
      try {
        return JSON.parse(script.textContent || '');
      } catch (e) {
        return null;
      }
    })
    .find(data => data && (data['@type'] === 'JobPosting' || data.jobPosting));
}

export function extractRequirements(): string {
  return Array.from(document.querySelectorAll('ul li, ol li'))
    .map(li => li.innerText.trim())
    .filter(text => 
      text.toLowerCase().includes('require') || 
      text.toLowerCase().includes('skill') ||
      text.toLowerCase().includes('experience')
    )
    .join('\n');
}