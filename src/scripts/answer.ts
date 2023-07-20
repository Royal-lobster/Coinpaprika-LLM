import { ChatAnthropic } from "langchain/chat_models/anthropic";
import { HumanMessage, SystemMessage } from "langchain/schema";
import fs from "fs";

// get -k or --key from command line
const CLAUDE_API_KEY = process.argv.indexOf("-k") > -1 ? process.argv[process.argv.indexOf("-k") + 1] : process.argv.indexOf("--key") > -1 ? process.argv[process.argv.indexOf("--key") + 1] : undefined;

if(!CLAUDE_API_KEY) {
  console.error("Please provide -k or --key as command line argument");
  process.exit(1);
}

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
      new HumanMessage("What is price of bitcoin")
    ],
  ]);

console.log(response.generations[0][0].text);
console.log(`Time Taken: ${performance.now() - now}`)
