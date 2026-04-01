import type { Request, Response } from 'express';
import { scrapeJobDescription } from '../utils/scraper.js';

export const scrapeJob = async (req: Request, res: Response) => {
  const { url } = req.body;

  if(!url){
    return res.status(400).json({error: "URL is required"})
  }

  try {
    const jobData = await scrapeJobDescription(url);

    if(jobData.description.length < 50) {
      return res.status(422).json({
        error: "Could not extract job description. Try a different URL.",
        data: jobData
      })
    }

    return res.status(200).json(jobData);
    
  } catch (error: any) {
    console.log("Error in scrape Job:", error.message);
    return res.status(500).json({ error: "Failed to scrape job", details: error.message });
  }
}