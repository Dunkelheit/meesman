'use strict';

const convict = require('convict');

const config = convict({
    loginUrl: {
        doc: 'The login URL of Meesman Indexbeleggen.',
        format: 'url',
        env: 'MEESMAN_LOGIN_URL',
        default: 'https://mijn.meesman.nl/login'
    },
    originUrl: {
        doc: 'The "origin" header to be sent in the login request.',
        format: 'url',
        env: 'MEESMAN_ORIGIN_URL',
        default: 'https://mijn.meesman.nl'
    },
    authority: {
        doc: 'The "authority" header to be sent in the login request.',
        format: String,
        env: 'MEESMAN_AUTHORITY',
        default: 'mijn.meesman.nl'
    },
    userAgent: {
        doc: 'The "user-agent" header to be sent in the login request',
        format: String,
        env: 'MEESMAN_USER_AGENT',
        default: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36'
    },
    username: {
        doc: 'Your Meesman Indexbeleggen username.',
        format: String,
        env: 'MEESMAN_USERNAME',
        default: ''
    },
    password: {
        doc: 'Your Meesman Indexbeleggen password.',
        format: String,
        env: 'MEESMAN_PASSWORD',
        default: '',
        sensitive: true
    }
});

config.validate();

module.exports = config;
