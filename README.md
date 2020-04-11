# covid-19-south-africa-scraper

## Description

A scraper that looks for COVID-19 data in https://sacoronavirus.co.za/category/press-releases-and-notices/ and https://raw.githubusercontent.com/dsfsi/covid19za/master/data.

NOTE: This is best automated and deployed to something like Heroku that can run this script every 10 min (for example).

## Development

1. Install dependencies:

```
yarn
```

2. Add Firebase service-account to `./src/firebase/service-account.json`.

3. Watch ts files:

```
yarn build:watch
```

4. Run built files (in another terminal):

```
yarn nodemon ./build/src/main.js
```
