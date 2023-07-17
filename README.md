# Coinpaprika graphql server

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
   bun run answer
```

To refresh graphql schema/update openapi, run 

```
bun run gen:resolve && bun run gen:graphql
```# coinpaprika-gpt
