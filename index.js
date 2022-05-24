'use-strict';
const fs = require("fs");
const csv = require("csv");
const path =  require("path");
const axios = require("axios");
const arguments = require('yargs').argv;

const fileContent = path.resolve(__dirname, "./transactions.csv");

const API_KEY = '430706e3c8f31908191aa80a949ecb9f16e0945412af51896f9e80522daf4457';

const maxRows = 1000000;
let numberOfOccurence = 0;
let isStreamPaused = false;

const parser = csv.parse({columns: true, skipEmptyLines: true});
const stream = fs.createReadStream(fileContent)
    .on("error", (err) => {
        console.log("Error while parsing CSV", err);
    })
    .pipe(parser);


// get latest porfolio value of tokens
const getLatestPortfolioValue = () => {
    const portfolio = {};
    return new Promise((resolve, reject) => {
        stream.on("data", (data) => {
            const {timestamp, token, transaction_type, amount} = data;
            // pausing stream to avoid memory leak
            numberOfOccurence++;
            // Stream pause;
            if (!isStreamPaused && numberOfOccurence >= maxRows) {
                isStreamPaused = true;
                stream.pause();
            }
            // Stream resume
            if (isStreamPaused) {
                isStreamPaused = false;
                numberOfOccurence = 0;
                stream.resume();
            }
            if (portfolio.hasOwnProperty(token)) {
                if (transaction_type === "WITHDRAWAL") {
                    portfolio[token].amount = (amount > portfolio[token].amount) ? 
                        (parseFloat(amount) - parseFloat(portfolio[token].amount)) : 
                        (parseFloat(portfolio[token].amount) - parseFloat(amount));
                } else {
                    portfolio[token].amount = parseFloat(portfolio[token].amount) + parseFloat(amount);
                }
                portfolio[token].timestamp = timestamp;                 
            } else {
                portfolio[data.token] = {token: token, amount: amount || 0, timestamp: timestamp || 0};
            }
        }).on('end', () => {
            resolve(portfolio);
        });
    });
};

// get crypto currency data from crypto compare API
const compareCrypto = (token) => { 
    const fsyms = (typeof token === 'object' ? token.join(',') : token);
    const url = `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${fsyms}&tsyms=BTC,USD,EUR&api_key=${API_KEY}`;
    const config = {
        method: 'GET',
        url,
        headers: { }
    };
    return new Promise((resolve, reject) => {
        axios(config)
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                reject(error);
            });
    })
};

// get command line arguments and filter data accordingly
const getCryptoDataByArgs = () => {
    //1. Given no parameters, return the latest portfolio value per token in USD
    if (!arguments.token && !arguments.date) {
        console.log("Given no parameters, return the latest portfolio value per token in USD");
        getLatestPortfolioValue().then((data) => {
            const tokens = Object.keys(data);
            compareCrypto(tokens).then((crypto) => {
                Object.keys(crypto).forEach(token => {
                    console.log(token,": ",data[token].amount * crypto[token].USD)
                });
            });
        });
    }

    //2. Given a token, return the latest portfolio value for that token in USD
    if (arguments.token && !arguments.date) {
        console.log("Given a token, return the latest portfolio value for that token in USD");
        getLatestPortfolioValue().then((data) => {
            const tokens = Object.keys(data);
            compareCrypto(tokens).then((crypto) => {
                Object.keys(crypto).forEach(token => {
                    if (arguments.token === token) {
                        console.log(token,": ",data[token].amount * crypto[token].USD)
                    }
                });
            });
        });
    }
};


getCryptoDataByArgs();
