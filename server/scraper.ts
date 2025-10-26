import axios from 'axios';
import * as cheerio from 'cheerio';

export interface ScrapedWebsiteData {
  title: string;
  description: string;
  headings: string[];
  paragraphs: string[];
  colors: string[];
  url: string;
  rawText: string;
}

export class URLValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'URLValidationError';
  }
}

function validateUrl(urlString: string): void {
  let parsedUrl: URL;
  
  try {
    parsedUrl = new URL(urlString);
  } catch {
    throw new URLValidationError('Invalid URL format');
  }

  if (parsedUrl.protocol !== 'https:' && parsedUrl.protocol !== 'http:') {
    throw new URLValidationError('Only HTTP and HTTPS protocols are allowed');
  }

  const hostname = parsedUrl.hostname.toLowerCase();

  if (/^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
    throw new URLValidationError('IP addresses are not allowed for security reasons');
  }

  if (/^[0-9a-f:]+$/i.test(hostname)) {
    throw new URLValidationError('IPv6 addresses are not allowed for security reasons');
  }

  const blockedHosts = [
    'localhost',
    '127.0.0.1',
    '0.0.0.0',
    '169.254.169.254',
    'metadata.google.internal',
  ];

  if (blockedHosts.includes(hostname)) {
    throw new URLValidationError('Access to this host is not allowed for security reasons');
  }

  const privateRanges = [
    /^10\./,
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
    /^192\.168\./,
    /^169\.254\./,
  ];

  for (const range of privateRanges) {
    if (range.test(hostname)) {
      throw new URLValidationError('Access to private network ranges is not allowed for security reasons');
    }
  }

  if (!hostname.includes('.')) {
    throw new URLValidationError('URL must be a valid domain name');
  }
}

export async function scrapeWebsite(url: string): Promise<ScrapedWebsiteData> {
  console.log(`Scraping website: ${url}`);
  
  validateUrl(url);
  console.log('URL validation passed');
  
  try {
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
      maxRedirects: 5,
    });

    const html = response.data;
    const $ = cheerio.load(html);

    const title = $('title').text().trim() || 
                  $('meta[property="og:title"]').attr('content') || 
                  $('h1').first().text().trim() || 
                  '';

    const description = $('meta[name="description"]').attr('content') || 
                       $('meta[property="og:description"]').attr('content') || 
                       $('p').first().text().trim() || 
                       '';

    const colors = new Set<string>();
    
    $('[style]').each((_, el) => {
      const style = $(el).attr('style') || '';
      const colorMatches = style.match(/#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}|rgb\([^)]+\)/g);
      if (colorMatches) {
        colorMatches.forEach(color => colors.add(color));
      }
    });

    $('style').each((_, el) => {
      const css = $(el).html() || '';
      const colorMatches = css.match(/#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}/g);
      if (colorMatches) {
        colorMatches.forEach(color => colors.add(color));
      }
    });

    const themeColor = $('meta[name="theme-color"]').attr('content');
    if (themeColor) {
      colors.add(themeColor);
    }

    $('script, style, nav, footer, header').remove();

    const headings: string[] = [];
    $('h1, h2, h3').each((_, el) => {
      const text = $(el).text().trim();
      if (text && text.length < 200) {
        headings.push(text);
      }
    });

    const paragraphs: string[] = [];
    $('p').each((_, el) => {
      const text = $(el).text().trim();
      if (text && text.length > 20 && text.length < 500) {
        paragraphs.push(text);
      }
    });

    const rawText = $('body').text()
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 3000);

    const result: ScrapedWebsiteData = {
      title,
      description,
      headings: headings.slice(0, 10),
      paragraphs: paragraphs.slice(0, 5),
      colors: Array.from(colors).slice(0, 20),
      url,
      rawText,
    };

    console.log('Scraping successful:', {
      url,
      titleLength: result.title.length,
      headingsCount: result.headings.length,
      paragraphsCount: result.paragraphs.length,
      colorsCount: result.colors.length,
    });

    return result;
  } catch (error: any) {
    if (error instanceof URLValidationError) {
      throw error;
    }
    
    console.warn('Scraping failed, will use fallback:', error.message);
    
    return {
      title: '',
      description: '',
      headings: [],
      paragraphs: [],
      colors: [],
      url,
      rawText: '',
    };
  }
}

export function buildEnrichedPrompt(url: string, scrapedData: ScrapedWebsiteData): string {
  const hasContent = scrapedData.title || scrapedData.headings.length > 0;
  
  if (!hasContent) {
    return `You are analyzing a local business website to create a branded gift card. 
      
Given this URL: ${url}

The website couldn't be accessed, so please make educated guesses based on the URL and common business patterns.

Please analyze the business and return a JSON object with the following structure:
{
  "businessName": "The business name",
  "businessType": "Type of business (e.g., 'Coffee Shop', 'Auto Detailing')",
  "brandColors": ["#hex1", "#hex2"],
  "emoji": "A single emoji that represents the business",
  "vibe": "Short description of the brand vibe (e.g., 'Cozy and artisanal')",
  "description": "One sentence description of what the business offers"
}

Return ONLY the JSON object, no other text.`;
  }

  return `You are analyzing a local business website to create a branded gift card.

Website URL: ${url}

SCRAPED WEBSITE CONTENT:

Title: ${scrapedData.title}

Description: ${scrapedData.description}

Key Headings:
${scrapedData.headings.slice(0, 5).map(h => `- ${h}`).join('\n')}

Sample Content:
${scrapedData.paragraphs.slice(0, 3).join('\n\n')}

${scrapedData.colors.length > 0 ? `Detected Colors: ${scrapedData.colors.slice(0, 10).join(', ')}` : ''}

Based on this REAL website content, please analyze the business and return a JSON object with the following structure:
{
  "businessName": "The business name (extract from the website content)",
  "businessType": "Type of business (e.g., 'Coffee Shop', 'Auto Detailing')",
  "brandColors": ["#hex1", "#hex2"] (use detected colors if available, or suggest colors that match the brand vibe),
  "emoji": "A single emoji that represents the business",
  "vibe": "Short description of the brand vibe based on the website content",
  "description": "One sentence description of what the business offers (based on actual content)"
}

Return ONLY the JSON object, no other text.`;
}
