'use strict';

const bunyan = require('bunyan');
const cheerio = require('cheerio');
const csv = require('fast-csv');
const fs = require('fs');
const moment = require('moment');
const numeral = require('numeral');
const request = require('request');

const config = require('./config');
const pkg = require('./package.json');

moment.locale('nl');

require('numeral/locales');
numeral.locale('nl-nl');

const log = bunyan.createLogger({
    name: pkg.name
});

const baseRequest = request.defaults({
    'user-agent': config.get('userAgent'),
    authority: config.get('authority'),
    'upgrade-insecure-requests': 1,
    dnt: 1
});

const formatters = {
    quantity: text => numeral(text).value(),
    money: text => formatters.quantity(text),
    date: text => moment(text, 'DD MMM YYYY').toString()
};

const rows = {
    Fonds: {
        formatter: text => text
    },
    Aantal: {
        formatter: formatters.quantity
    },
    Koers: {
        formatter: formatters.money
    },
    Valutadatum: {
        formatter: formatters.date
    },
    Waarde: {
        formatter: formatters.money
    },
    'Ongerealiseerd resultaat': {
        formatter: formatters.money
    }
};

function logResponse(err, res, body) {
    if (err) {
        log.error(err);
    }
    if (res) {
        log.debug({
            headers: res.headers,
            statusCode: res.statusCode
        });
    }
    log.trace(body);
}

log.info('Connecting to server');

baseRequest({
    method: 'POST',
    uri: config.get('loginUrl'),
    headers: {
        origin: config.get('originUrl'),
        referer: config.get('loginUrl')
    },
    form: {
        'return_uri': '/',
        'formdata[isSubmitted_loginform]': 'login-submit',
        'formdata[logout_every_session][dmy]': '1',
        'formdata[username]': config.get('username'),
        'formdata[password][autocompleteHoneyPot]': '',
        'formdata[password][real]': config.get('password'),
        'formdata[submit]': 'login-submit'
    }
}, function (err, res, body) {
    logResponse(err, res, body);

    if (res.statusCode !== 302) {
        log.error({
            headers: res.headers,
            statusCode: res.statusCode
        }, 'Unexpected status code');
        return;
    }

    const cookies = res.headers['set-cookie'].map(function (dough) {
        return dough.split(';')[0];
    }).join('; ');

    baseRequest({
        method: 'GET',
        uri: 'https://mijn.meesman.nl/portefeuille',
        headers: {
            referer: 'https://mijn.meesman.nl/',
            cookie: cookies
        }
    }, function (err, res, body) {
        logResponse(err, res, body);

        const $ = cheerio.load(body);
        const csvRows = [];

        const total = formatters.money($('.total-bar', '.fundtable').text());
        const now = moment().toString();

        log.info('Got response from server, starting data export');

        $('tr.actual-data', '.fundtable').each(function (i, elem) {
            const csvRow = {
                created: now
            };
            Object.keys(rows).forEach(function (row) {
                const value = $(`td[data-th="${row}"]`, $(elem)).text();
                csvRow[row] = rows[row].formatter(value);
            });
            csvRow.total = total;
            csvRows.push(csvRow);
        });

        log.info(csvRows, 'Writing rows to CSV');

        const ws = fs.createWriteStream('meesman.csv', { flags: 'a' });
        csv
            .writeToStream(ws, csvRows, {
                headers: false,
                quoteHeaders: true,
                quoteColumns: true,
                includeEndRowDelimiter: true
            })
            .on('finish', function () {
                log.info('Finished exporting data');
            });
    });
});


