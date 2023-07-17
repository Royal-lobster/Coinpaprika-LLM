import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { CallBackendArguments, createSchema } from 'swagger-to-graphql';

const app = express();

// Define your own http client here
async function callBackend({
    requestOptions: { method, body, baseUrl, path, query, headers },
  }: CallBackendArguments<{}>) {
    const url = `${baseUrl}${path}?${new URLSearchParams(query as Record<
      string,
      string
    >)}`;
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify(body),
    });
    const text = await response.text();
    if (200 <= response.status && response.status < 300) {
      try {
        return JSON.parse(text);
      } catch (e) {
        return text;
      }
    }
    throw new Error(`Response: ${response.status} - ${text}`);
  }

createSchema({
  swaggerSchema: `src/data/api.json`,
  callBackend,
})
  .then(schema => {
    app.use(
      '/graphql',
      graphqlHTTP(() => {
        return {
          schema,
          graphiql: true,
        };
      }),
    );

    app.listen(3009, 'localhost', () => {
      console.info('http://localhost:3009/graphql');
    });
  })
  .catch(e => {
    console.log(e);
  });