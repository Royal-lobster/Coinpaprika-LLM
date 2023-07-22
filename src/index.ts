import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { ChatAnthropic } from "langchain/chat_models/anthropic";
import { getArgValue } from "./helpers/getArgValue.js";
import { CoinpaprikaTool } from "./tools/coinpaprika/index.js";
import 'dotenv/config'

const QUERY = getArgValue("-q", "--query");

const model = new ChatAnthropic({
  temperature: 0,
  anthropicApiKey: process.env.CLAUDE_API_KEY, // In Node.js defaults to process.env.ANTHROPIC_API_KEY
  modelName: "claude-2",
});

const now = performance.now();

const executor = await initializeAgentExecutorWithOptions([new CoinpaprikaTool(model)], model, {
  agentType: "zero-shot-react-description",
  verbose: true,
  maxIterations: 8,
  returnIntermediateSteps: true,
});

const response = await executor.call({input: QUERY});

console.log(`
✅ Answer:\n${response.output}
⏱️ Time Taken: ${performance.now() - now}
`);
