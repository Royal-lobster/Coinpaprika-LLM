import { PineconeClient } from "@pinecone-database/pinecone";
import { patchSchemaForEnums } from "../../scripts/patchSchemaForEnums.js";
import { PineconeStore } from "langchain/vectorstores";
import { OpenAIEmbeddings } from "langchain/embeddings";

export const getPatchedEnumsSchema = async (schema: string, query: string) => {
  const client = new PineconeClient();
  await client.init({
    apiKey: process.env.PINECONE_API_KEY,
    environment: process.env.PINECONE_ENVIRONMENT,
  });
  const pineconeIndex = client.Index(process.env.PINECONE_INDEX);

  const vectorStore = await PineconeStore.fromExistingIndex(
    new OpenAIEmbeddings(),
    { pineconeIndex }
  );

  /* Search the vector DB independently with meta filters */
  const results = await vectorStore.similaritySearch(query, 15);

  const enumValues = results.map((result) => result.pageContent.split("---")[0].trim());
  return patchSchemaForEnums("coin_id", "CoinID", enumValues, schema);
};
