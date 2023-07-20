# Coinpaprika Claude

Experimental project to wrap Coinpaprika API to graphql and integrating it with claude 2 to get 
graphql query from user questions

## How to run
1. Add your CLAUDE_API_KEY to .env file
2. Run yarn install
3. You can run graphql server and run answer script to get answers to your crypto queries from Claude with help of coinpaprika. 
check out the commands below 

## Commands

### Running graphql server
This runs coinpaprika graphql wrapper server

```bash
   yarn run graphql 
```

### Running answer script
Get queries from LLM (Make sure graphql server is running as well)

```bash
   yarn run answer -q -- "What is price of Bitcoin"
```

### Refresh graphql schemas
We are copying openapi folder from https://github.com/coinpaprika/coinpaprika.github.io. incase there is a update there we can generate graphql schema by this script 

```bash
yarn run gen:resolve && yarn run gen:graphql
```

1. coinpaprika openapi spec docs have $ref declarations to split documentation to many files which is not supported by swagger-to-graphql tool. So we are resolving all $ref to one full big json and saving it.
2. We are generating graphql schema from swagger-to-graphql tool by referencing the resolved json file
