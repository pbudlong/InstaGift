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

export async function scrapeWebsite(url: string): Promise<ScrapedWebsiteData> {
  try {
    console.log(`Scraping website: ${url}`);
    
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
      maxRedirects: 5,
    });

    const html = response.data;
    const $ = cheerio.load(html);

    // Remove script, style, and nav elements to get clean content
    $('script, style, nav, footer, header').remove();

    // Extract title
    const title = $('title').text().trim() || 
                  $('meta[property="og:title"]').attr('content') || 
                  $('h1').first().text().trim() || 
                  '';

    // Extract description
    const description = $('meta[name="description"]').attr('content') || 
                       $('meta[property="og:description"]').attr('content') || 
                       $('p').first().text().trim() || 
                       '';

    // Extract headings (h1, h2, h3)
    const headings: string[] = [];
    $('h1, h2, h3').each((_, el) => {
      const text = $(el).text().trim();
      if (text && text.length < 200) {
        headings.push(text);
      }
    });

    // Extract paragraphs
    const paragraphs: string[] = [];
    $('p').each((_, el) => {
      const text = $(el).text().trim();
      if (text && text.length > 20 && text.length < 500) {
        paragraphs.push(text);
      }
    });

    // Extract colors from CSS and inline styles
    const colors = new Set<string>();
    
    // From inline styles
    $('[style]').each((_, el) => {
      const style = $(el).attr('style') || '';
      const colorMatches = style.match(/#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}|rgb\([^)]+\)/g);
      if (colorMatches) {
        colorMatches.forEach(color => colors.add(color));
      }
    });

    // From style tags
    $('style').each((_, el) => {
      const css = $(el).html() || '';
      const colorMatches = css.match(/#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}/g);
      if (colorMatches) {
        colorMatches.forEach(color => colors.add(color));
      }
    });

    // From meta theme-color
    const themeColor = $('meta[name="theme-color"]').attr('content');
    if (themeColor) {
      colors.add(themeColor);
    }

    // Get body text for general analysis
    const rawText = $('body').text()
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 3000); // Limit to first 3000 chars

    const result: ScrapedWebsiteData = {
      title,
      description,
      headings: headings.slice(0, 10), // Top 10 headings
      paragraphs: paragraphs.slice(0, 5), // Top 5 paragraphs
      colors: Array.from(colors).slice(0, 20), // Top 20 colors
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
    console.error('Scraping error:', error.message);
    
    // Return minimal data on error
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
    // Fallback to URL-based analysis if scraping failed
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
