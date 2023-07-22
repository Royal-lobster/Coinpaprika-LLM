import { readFileSync } from "fs";

const schema = readFileSync("src/data/schema.graphql").toString();

export const getSelectModelsSchemas = (similarModels: string[]) => {
    const allModels = schema.split("\ntype ").filter(Boolean).map(s=>`type ${s.trim()}`)
    const filteredModels = allModels.filter(model => similarModels.includes(model.split("{")[0].replace("type", "").trim()))
    console.log(`\n🧬 Selected Models:\n${filteredModels.join("\n")}`);

    return filteredModels
}