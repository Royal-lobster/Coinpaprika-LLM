import { ChatAnthropic } from "langchain/chat_models/anthropic";
import { HumanMessage, SystemMessage } from "langchain/schema";
import fs from "fs";
import axios from "axios";
import { Tool } from "langchain/tools";
import { initializeAgentExecutorWithOptions } from "langchain/agents";

const getInput = (shortKey: string, longKey: string) => {
  const allArgs = process.argv;
  const allKeys = [shortKey, longKey];
  if (!allArgs.some((arg) => allKeys.includes(arg))) {
    console.error(
      `Please provide ${shortKey} or ${longKey} as command line argument`
    );
    process.exit(1);
  }
  const index = allArgs.findIndex((arg) => allKeys.includes(arg));
  let value = "";
  for (let i = index + 1; i < allArgs.length; i++) {
    if (allArgs[i].startsWith("-")) break;
    value += `${allArgs[i]} `;
  }
  value = value.trim();
  console.log(`🏗️ Using ${longKey.split("--")[1]} as ${value}`);
  return value;
};

const CLAUDE_API_KEY = getInput("-k", "--key");
const QUERY = getInput("-q", "--query");

const file = fs.readFileSync("src/data/types.graphql");
const typeDefs = file.toString();

const model = new ChatAnthropic({
  temperature: 0,
  anthropicApiKey: CLAUDE_API_KEY, // In Node.js defaults to process.env.ANTHROPIC_API_KEY
  modelName: "claude-2",
});

const now = performance.now();

class CoinpaprikaTool extends Tool {
  name = "coinpaprika";
  description = `
  - Use this tool when the question asked by user includes price, market cap, 
    volume, etc. of a cryptocurrency token or NFT.
  - Input for this tool must json string with keys "question" and "original question",
    where question is the question asked by user and original question is the question
`;

  async _call(input: string) {
    const response = await model.generate([
      [
        new SystemMessage(
          `Your task is to generate a graphql query according to the user question and given graphql type defs.
        
        Graphql Type Defs:
        ${typeDefs}

        Response structure:
        - Please answer the question in the form of a graphql query as shown between triple quote delimiters 
        - Do not explain, just answer with a graphql query in following format:

        """
        query {
          // enter generated query here
        }
        """
        `
        ),
        new HumanMessage(QUERY),
      ],
    ]);

    const generatedText = response.generations[0][0].text.trim();

    console.log(`\n🧬 Generated Text:\n${generatedText}`);

    if (!generatedText.startsWith(`"""`) || !generatedText.endsWith(`"""`)) {
      console.error(`Generated text does not start or end with triple quotes`);
      process.exit(1);
    }

    const query = generatedText.replaceAll(`"""`, "").trim();
    const { data } = await axios.post("http://localhost:3009/graphql", {
      query,
    });
    const stringifiedData = JSON.stringify(data, null, 4);

    return `
      Here is the data required for your answer for question "${QUERY}":
      ${stringifiedData}
    `
  }
}


const executor = await initializeAgentExecutorWithOptions([new CoinpaprikaTool()], model, {
  agentType: "zero-shot-react-description",
  verbose: true,
  maxIterations: 8,
  returnIntermediateSteps: true,
});

const response = await executor.call({input: QUERY});

console.log(`\n✅ Answer:\n${response.output}`);


console.log(`Time Taken: ${performance.now() - now}`);
