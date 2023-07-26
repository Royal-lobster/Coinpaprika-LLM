import axios from "axios";
import { BaseChatModel } from "langchain/chat_models";
import { HumanMessage, SystemMessage } from "langchain/schema";
import { Tool } from "langchain/tools";
import { getPatchedEnumsSchema } from "./getPatchedEnumsSchema.js";
import { getSelectModelsSchemas } from "./getSelectModelsSchemas.js";
import { getSimilarModels } from "./getSimilarModels.js";


export class CoinpaprikaTool extends Tool {
  name = "coinpaprika";
  description = `
    - Use this tool when the question asked by user includes price, market cap, 
      volume, etc. of a cryptocurrency token or NFT.
    - Input for this tool must json string with keys "question" and "original question",
      where question is the question asked by user and original question is the question
  `;

  model: BaseChatModel;

  constructor(model: BaseChatModel) {
    super();
    this.model = model;
  }

  async _call(input: string) {
    const similarModels = await getSimilarModels(this.model, input);
    const filteredSchema = getSelectModelsSchemas(similarModels);
    const patchedSchema = getPatchedEnumsSchema(filteredSchema, input);

    const response = await this.model.generate([
      [
        new SystemMessage(
          `Instructions:
            - Your task is to generate a graphql query according to the user question and given graphql 
              schema.
            - You must generate valid graphql query. and make sure the query matches the given graphql
              schema.
            - Do not try to pass value for JSON fields. treat them like a string.
            - Do not build the query with empty strings. if you don't have value for a field, just
              remove that field from the query or input argument as long as it is not required.
          
            Graphql schema:
            ${patchedSchema}
  
            Answer format:
            - Please answer the question in the form of a graphql query
            - Do not wrap the query in any other syntax.
            - Answer must start with "query{" and end with "}"
            - Do not add any other text in the answer. directly start with query.
            - Follow the format to answer below:
  
            query {
              // enter generated query here
            }
          `
        ),
        new HumanMessage(input),
      ],
    ]);

    const query = response.generations[0][0].text.trim();

    console.log(`\n🧬 Generated Query:\n${query}`);

    if (!query.startsWith(`query {`) || !query.endsWith(`}`)) {
      console.error(`\n🚨 Generated text does not have valid syntax`);
      process.exit(1);
    }

    try {
      const { data } = await axios.post("http://localhost:3009/graphql", {
        query,
      });      
      const stringifiedData = JSON.stringify(data, null, 4);
      return `
        Here is the data required for your answer for question "${input}":
        ${stringifiedData}
      `;
    } catch (e) {
      console.error("\n🚨 Error retrieving data from GraphQL: ", e.response?.data || e);
      process.exit(1);
    }
  }
}
