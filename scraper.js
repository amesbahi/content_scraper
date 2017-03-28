'use strict';

// Include modules
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var json2csv = require('json2csv');


// Program scraper to check for a folder called ‘data’. If the folder doesn’t exist,
// the scraper should create one. If the folder does exist, the scraper should do nothing.
if (!fs.existsSync('./data')) {
    fs.mkdirSync('./data');
}

// Function to use when making a GET request to shirts4mike
function getRequest(url, callback) {
    request({
        method: 'GET',
        url: url
    }, function (err, response, body) {
        if (!err && response.statusCode == 200) {
            return callback(null, body); // Ask Trevor about origin of this syntax
        } else {
            //return console.error(callback(`Sorry, there was a` + response.statusCode + `error.`));
            return console.error("Looks like there's an error. Please try again later.");
        }
    });
}

// get t-shirt links
// function will take no params -- only callback
// build up array of URLs for t-shirt pages
// return callback by passing array of t-shirt links into callback

// Function to scrape each shirt's product detail page link
function getShirtLinks(callback) {
    getRequest("http://www.shirts4mike.com/shirts.php", function (err, body) {
        if (err != null) {
            return callback(err);
        }
        let $ = cheerio.load(body);
        // array to hold all of the shirt URLs
        let shirtURLs = [];
        $('ul.products a').each(function (index, element) {
            let hrefLink = element.attribs.href;
            let url = "http://www.shirts4mike.com/" + hrefLink;
            shirtURLs.push(url);
        });
        return callback(null, shirtURLs);
    });
}

// Function to get all of the details from each shirt's product detail page
function getShirtDetails(callback) {
    getShirtLinks(function (err, shirtURLs) {
        if (err != null) {
            return callback(err);
        }

        // Array to hold each shirt's detail
        let shirtData = [];

        // Variable to track how many requests we've made
        let requestCounter = 0;
        shirtURLs.forEach(function (shirtURL) {
            getRequest(shirtURL, function (err, body) {
                if (err != null) {
                    return callback(err);
                }

                let $ = cheerio.load(body);
                let shirtDetailsObject = {
                    title: $('title').text(),
                    price: $('span.price').text(),
                    shirtURL: $('div.shirt-picture span img').attr('src'),
                    url: shirtURL,
                    time: `${year}-${mm}-${dd}`
                };

                shirtData.push(shirtDetailsObject);
                requestCounter++;

                // Once we've requested all of the shirt's detail data, return the array of data
                if (requestCounter == shirtURLs.length) {
                    return callback(null, shirtData);
                }

            });
        });
    });
}

// can live in another file, etc...

// Format date for CSV file
let todaysDate = new Date();
let year = todaysDate.getFullYear();
let mm = todaysDate.getMonth() + 1;
let dd = todaysDate.getDate();
console.log(year, mm, dd);

// Putting all of the data in a CSV file
getShirtDetails(function (err, shirtDetails) {
    console.log(err, shirtDetails);
    let fields = ["title", "price", "shirtURL", "url", "time"];

    let csv = json2csv({ data: shirtDetails, fields: fields });

    fs.writeFile('./data/' + `${year}-${mm}-${dd}` + '.csv', csv, function (err) {
        if (err) throw err;
        console.log('file saved');
    });
});