// 'use strict';

// Include modules
const fs = require('fs');

// Program your scraper to check for a folder called ‘data’. If the folder doesn’t exist,
// the scraper should create one. If the folder does exist, the scraper should do nothing.

if (!fs.existsSync('./data')) {
    fs.mkdirSync('./data');
}