# hall-of-framed-db

## Description

As far as I understand it, the `hall-of-framed-db` project was designed to create `authorsdb.json` and `shotsdb.json` as static databases from scraping Framed data. The main obstacle was in the context of web applications, you'd have to fetch the _entire_ JSON file if you wanted data on _any_ shot, or _any_ author. The purpose of the `framed-api` Node JS application is to wrap `authorsdb.json` and `shotsdb.json` in a GraphQL API to make this data easier to access without overfetching.

## Developing

1. rename `.env.boilerplate` to `.env`
2. run `npm i`
3. run `npm run dev`
4. visit `http://localhost:4000/` to test queries out and view documentation
