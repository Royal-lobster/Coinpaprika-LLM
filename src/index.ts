import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { getArgValue } from "./helpers/getArgValue.js";
import { CoinpaprikaTool } from "./tools/coinpaprika/index.js";
import 'dotenv/config'

const QUERY = getArgValue("-q", "--query");

const model = new ChatOpenAI({
  temperature: 0,
  openAIApiKey: process.env.OPENAI_API_KEY, // In Node.js defaults to process.env.OPENAI_API_KEY
  modelName: "gpt-3.5-turbo-0613",
});

const now = performance.now();

const executor = await initializeAgentExecutorWithOptions([new CoinpaprikaTool(model)], model, {
  agentType: "openai-functions",
  verbose: true,
  maxIterations: 8,
  returnIntermediateSteps: true,
});

const response = await executor.call({input: QUERY});

console.log(`
✅ Answer:\n${response.output}
⏱️ Time Taken: ${performance.now() - now}
`);
