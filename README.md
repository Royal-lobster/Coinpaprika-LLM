# Coinpaprika Claude

Experimental project to wrap Coinpaprika API to graphql and integrating it with claude 2 to get 
graphql query from user questions

## How to run
Install bun to run scripts 

- Running graphql server
```
   bun run graphql 
```

- Get queries from LLM, 
```
   bun run answer -k YOUR_CLAUDE_API_KEY -q "What is price of Bitcoin"
```

To refresh graphql schema/update openapi, run 

```
bun run gen:resolve && bun run gen:graphql
```# coinpaprika-gpt
