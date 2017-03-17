'use strict';

// Include modules
const fs = require('fs');
const cheerio = require('cheerio');
const json2csv = require('json2csv');
const http = require('http');

// Program scraper to check for a folder called ‘data’. If the folder doesn’t exist,
// the scraper should create one. If the folder does exist, the scraper should do nothing.
if (!fs.existsSync('./data')) {
    fs.mkdirSync('./data');
}

// Connect to the API URL (http://shirts4mike.com/shirts.php)
const request = http.get("http://www.shirts4mike.com/shirts.php", response => {
    let body = "";
    // Read the data
    response.on('data', data => {
        body += data.toString();
    });

    response.on('end', () => {

    });
});