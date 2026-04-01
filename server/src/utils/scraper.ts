import axios from 'axios';
import * as cheerio from 'cheerio';

export const scrapeJobDescription = async (url: string) => {
  //Destructuring the data from the axios get request
	const { data: html } = await axios.get(url, {
		headers: {
			'User-Agent':
				'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
		},
	});

  //Passing the html to cheerio to load the data
	const $ = cheerio.load(html);

	const titleText = $('title').text() || '';
	let title = titleText || $('h1').first().text() || '';
	
	// Clean title (remove common suffixes)
	title = (title.split(' | ')[0] || '').split(' - ')[0]?.trim() || '';

	const description = $('.description, .job-description, #jobDescriptionText, .show-more-less-html__content').text() || $('body').text();

	let company = $('.top-card-layout__first-subline-link, .topcard__org-name-link, .company, [data-company]').first().text() || '';

	// If company is still empty, try to extract from the raw title if it followed a pattern
	if (!company && titleText.includes(' at ')) {
		const parts = titleText.split(' at ');
		if (parts.length > 1) {
			company = parts[1]?.split(' | ')[0]?.trim() || '';
		}
	}

	return {
		title: title.trim() || 'Untitled Role',
		description: (description || '').replace(/\s+/g, ' ').trim(),
		company: (company || '').trim() || 'Unknown Company',
	};
};
