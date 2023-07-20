import { ChatAnthropic } from "langchain/chat_models/anthropic";
import { HumanMessage, SystemMessage } from "langchain/schema";
import fs from "fs";

const getInput = (shortKey: string, longKey: string) => {
  const allArgs = process.argv;
  const allKeys = [shortKey, longKey];
  if (!allArgs.some(arg => allKeys.includes(arg))) {
    console.error(`Please provide ${shortKey} or ${longKey} as command line argument`);
    process.exit(1);
  }
  const index = allArgs.findIndex(arg => allKeys.includes(arg));
  let value = '';
  for(let i = index + 1; i < allArgs.length; i++) {
    if(allArgs[i].startsWith('-')) break;
    value += `${allArgs[i]} `;
  }
  value = value.trim();
  console.log(`Using ${longKey.split("--")[1]} as ${value}`);
  return value;
};


const CLAUDE_API_KEY = getInput("-k", "--key");
const QUERY = getInput("-q", "--query");

const file = fs.readFileSync("src/data/types.graphql");
const typeDefs = file.toString();

const model = new ChatAnthropic({
  temperature: 0,
  anthropicApiKey: CLAUDE_API_KEY, // In Node.js defaults to process.env.ANTHROPIC_API_KEY
  modelName: "claude-2"
});

const now = performance.now()
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
      new HumanMessage(QUERY)
    ],
  ]);

console.log(response.generations[0][0].text);
console.log(`Time Taken: ${performance.now() - now}`)
