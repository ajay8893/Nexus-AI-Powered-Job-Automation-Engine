import puppeteer from 'puppeteer';
import { marked } from 'marked';

/**
 * Generates an ATS-friendly PDF from a Markdown string.
 * Focused on a single-column, clean layout with selectable text.
 */
export const generateATSResumePDF = async (markdown: string) => {
	// 1. Clean the markdown: Ensure it only contains the resume part
	let resumeMarkdown = markdown;
	if (markdown.includes('# 🚀 Tailored Resume')) {
		resumeMarkdown = markdown.split('# 🚀 Tailored Resume')[1] || markdown;
	} else if (markdown.includes('#')) {
		// If no explicit header, just use the whole thing
		resumeMarkdown = markdown;
	}

	// 2. Parse Markdown to HTML
	const htmlBody = await marked.parse(resumeMarkdown);

	// 3. Define ATS-Friendly CSS
	const atsStyles = `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
      
      body {
        font-family: 'Inter', Arial, sans-serif;
        line-height: 1.5;
        color: #000;
        margin: 0;
        padding: 0;
        background: #fff;
      }
      
      .container {
        padding: 40px;
        max-width: 800px;
        margin: 0 auto;
      }

      /* Headers */
      h1 { font-size: 24pt; margin-bottom: 4px; text-align: center; font-weight: 700; }
      h2 { 
        font-size: 13pt; 
        border-bottom: 1px solid #333; 
        margin-top: 24px; 
        margin-bottom: 8px; 
        text-transform: uppercase; 
        font-weight: 700;
        letter-spacing: 0.5px;
      }
      h3 { font-size: 11pt; margin-top: 12px; margin-bottom: 4px; font-weight: 700; }
      
      /* Content */
      p, li { font-size: 10pt; margin-bottom: 4px; color: #1a1a1a; }
      ul { margin-top: 4px; margin-bottom: 12px; padding-left: 18px; }
      li { margin-bottom: 3px; }
      
      /* Contact Info Section (Usually Top) */
      .contact-info {
        text-align: center;
        font-size: 9pt;
        margin-bottom: 20px;
        color: #444;
      }
      
      /* Links and Formatting */
      a { color: #000; text-decoration: none; }
      strong { font-weight: 700; }
      
      /* Page Breaks */
      @media print {
        h2 { page-break-after: avoid; }
        .section { page-break-inside: avoid; }
      }
    </style>
  `;

	// 4. Launch Puppeteer
	const browser = await puppeteer.launch({
		headless: true, // Use the new headless mode if available
		args: ['--no-sandbox', '--disable-setuid-sandbox'],
	});

	try {
		const page = await browser.newPage();
		
		// Set full HTML content
		const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          ${atsStyles}
        </head>
        <body>
          <div class="container">
            ${htmlBody}
          </div>
        </body>
      </html>
    `;

		await page.setContent(fullHtml, { waitUntil: 'networkidle0' });

		// Generate PDF
		const pdfBuffer = await page.pdf({
			format: 'A4',
			printBackground: true,
			margin: {
				top: '0.75in',
				bottom: '0.75in',
				left: '0.75in',
				right: '0.75in',
			},
			displayHeaderFooter: false,
		});

		return pdfBuffer;
	} finally {
		await browser.close();
	}
};
