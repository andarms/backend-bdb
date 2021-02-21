# Project Backend

![CircleCI](https://circleci.com/gh/andarms/backend-bdb.svg?style=svg&circle-token=bc58e9fab641f2e5ff17baab33b45c3c9d3a716f)

## Run Project

- use [.env.sample](.env.sample) to set environment variables and create proper `.env` file
- Init database using docker-compose file `docker-compose up`
- run application `npm start`

- run tests with `npm test`

## why Postgres?

it not common to use node with a SQl database like Postgres, but I don't know how to use REDIS or ElasticSearch and after a short search it's seem something that will take all the weekend just to understand and setup the right environment. That's is why I prefers to use something familiar like Postgres
