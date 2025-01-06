#!/usr/bin/env node

import axios from 'axios';
import * as cheerio from 'cheerio';
import Table from 'cli-table3';
import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';
import * as xlsx from 'xlsx';

async function scrapeCarDetails(url) {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    // Extracting data from the Carzone page based on the updated HTML structure
    const carName = $('span.fpa-title__inner').text().trim() || 'N/A';
    const price = $('div.cz-price span').first().text().trim() || 'N/A';
    const nct = $('li#nct span.fpa-features__item__text').text().trim() || 'N/A';
    const location = $('p.fpa-actions__sub-title').text().trim() || 'N/A';
    const keyFeatures = [
      $('li#engine span.fpa-features__item__text').text().trim(),
      $('li#bodytype span.fpa-features__item__text').text().trim(),
      $('li#transmission span.fpa-features__item__text').text().trim(),
      $('li#colour span.fpa-features__item__text').text().trim(),
      $('li#mileage span.fpa-features__item__text').text().trim(),
      $('li#seats span.fpa-features__item__text').text().trim(),
    ].filter(Boolean).join(', ') || 'N/A';
    const transmission = $('li#transmission span.fpa-features__item__text').text().trim() || 'N/A';
    const tax = $('li#tax-band span.fpa-features__item__text').text().trim() || 'N/A';
    const mileage = $('li#mileage span.fpa-features__item__text').text().trim() || 'N/A';
    const fuelType = $('li#engine span.fpa-features__item__text').text().trim() || 'N/A';

    return {
      url,
      carName,
      price,
      nct,
      location,
      keyFeatures,
      transmission,
      tax,
      mileage,
      fuelType,
    };
  } catch (error) {
    console.error(`Error scraping ${url}: ${error.message}`);
    return {
      url,
      carName: `Error: ${error.message}`,
      price: 'N/A',
      nct: 'N/A',
      location: 'N/A',
      keyFeatures: 'N/A',
      transmission: 'N/A',
      tax: 'N/A',
      mileage: 'N/A',
      fuelType: 'N/A',
    };
  }
}

async function main() {
  const { urls } = await inquirer.prompt([
    {
      type: 'input',
      name: 'urls',
      message: 'Enter a comma-separated list of car URLs:',
    },
  ]);

  const urlList = urls.split(',').map((url) => url.trim());
  const results = [];

  for (const url of urlList) {
    console.log(`Scraping: ${url}`);
    const result = await scrapeCarDetails(url);
    results.push(result);
  }

  // Define headers consistently for all output formats
  const headers = [
    'Car Name',
    'Price',
    'NCT',
    'Location',
    'Key Features',
    'Transmission',
    'Tax',
    'Mileage',
    'Fuel Type',
    'URL'
  ];

  // Create CLI table
  const table = new Table({ head: headers });

  results.forEach((result) => {
    table.push([
      result.carName,
      result.price,
      result.nct,
      result.location,
      result.keyFeatures,
      result.transmission,
      result.tax,
      result.mileage,
      result.fuelType,
      result.url
    ]);
  });

  console.log(table.toString());

  const { saveFileType } = await inquirer.prompt([
    {
      type: 'list',
      name: 'saveFileType',
      message: 'Would you like to save the results as a file? If so, select the file type:',
      choices: ['CSV', 'Excel', 'None'],
      default: 'None',
    },
  ]);

  if (saveFileType !== 'None') {
    const filePath = path.join(process.cwd(), `car_details.${saveFileType === 'Excel' ? 'xlsx' : 'csv'}`);

    // Format data consistently for both CSV and Excel
    const data = results.map((result) => ({
      'Car Name': result.carName,
      'Price': result.price,
      'NCT': result.nct,
      'Location': result.location,
      'Key Features': result.keyFeatures,
      'Transmission': result.transmission,
      'Tax': result.tax,
      'Mileage': result.mileage,
      'Fuel Type': result.fuelType,
      'URL': result.url
    }));

    if (saveFileType === 'CSV') {
      // Create CSV with proper escaping and handling of special characters
      const csvContent = [
        headers.join(','),
        ...data.map(row => 
          headers.map(header => 
            // Escape fields containing commas or quotes
            typeof row[header] === 'string' && (row[header].includes(',') || row[header].includes('"'))
              ? `"${row[header].replace(/"/g, '""')}"`
              : row[header]
          ).join(',')
        )
      ].join('\n');
      
      fs.writeFileSync(filePath, csvContent);
    } else if (saveFileType === 'Excel') {
      // Create Excel file with proper column headers
      const worksheet = xlsx.utils.json_to_sheet(data, { header: headers });
      const workbook = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(workbook, worksheet, 'Car Details');
      xlsx.writeFile(workbook, filePath);
    }

    console.log(`Results saved to ${filePath}`);
  }
}

main().catch((error) => {
  console.error(`Unexpected error: ${error.message}`);
  process.exit(1);
});
