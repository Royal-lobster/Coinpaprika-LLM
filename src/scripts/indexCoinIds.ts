import { PineconeClient } from "@pinecone-database/pinecone";
import * as dotenv from "dotenv";
import { Document } from "langchain/document";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";

dotenv.config();

const COIN_RANK_THRESHOLD = 1000;

const client = new PineconeClient();
await client.init({
  apiKey: process.env.PINECONE_API_KEY,
  environment: process.env.PINECONE_ENVIRONMENT,
});
const pineconeIndex = client.Index(process.env.PINECONE_INDEX);

const url = "https://api.coinpaprika.com/v1/coins"
const res = await fetch(url)
const coins = await res.json() as {id: string, name: string, symbol: string, rank: number}[]
const coinIds = coins.filter(c => c.rank < COIN_RANK_THRESHOLD && c.rank !== 0).map((coin) => {
    return `
    ${coin.id}
    ---
    Name: ${coin.name}
    Symbol: ${coin.symbol}
    `
})

const docs = coinIds.map((coinId: string) => 
  new Document({
    pageContent: coinId,
  })
);
 
console.log("⏳ Indexing Started");
await PineconeStore.fromDocuments(docs, new OpenAIEmbeddings(), {
  pineconeIndex,
});
console.log("✅ Indexing Complete");