# crypto-portfolio

## Question

Let us assume you are a crypto investor. You have made transactions over a period of time which is logged in a CSV file. Write a command line program that does the following

    Given no parameters, return the latest portfolio value per token in USD
    Given a token, return the latest portfolio value for that token in USD
    Given a date, return the portfolio value per token in USD on that date
    Given a date and a token, return the portfolio value of that token in USD on that date

The CSV file has the following columns

    timestamp: Integer number of seconds since the Epoch
    transaction_type: Either a DEPOSIT or a WITHDRAWAL
    token: The token symbol
    amount: The amount transacted

Portfolio means the balance of the token where you need to add deposits and subtract withdrawals. You may obtain the exchange rates from cryptocompare where the API is free. You should write it in Node.js as our main stack is in Javascript/Typescript and we need to assess your proficiency.

## Prerequisite

Run these command to installs required packages

* `npm install csv` (To parse CSV)
* `npm install axios` (To call an API)
* `npm install yargs` (To take and use arguments from command line)

## Execute Program

* Given no parameters, return the latest portfolio value per token in USD

  `node index.js`
* Given a token, return the latest portfolio value for that token in USD

  `node index.js --token=BTC`
* Given a date, return the portfolio value per token in USD on that date

  `node index.js --date=2019-10-25` (Date format: YYYY-MM-DD)
* Given a date and a token, return the portfolio value of that token in USD on that date

  `node index.js --date=2019-10-25 --token=BTC`
