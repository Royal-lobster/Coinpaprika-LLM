import { readFileSync } from "fs";
import { getSimplifiedSchema } from "../../helpers/getSimplifiedSchema.js";

const schema = readFileSync("src/data/schema.graphql").toString();

export const getSelectModelsSchemas = (similarModels: string[]) => {
    const simplifiedSchema =  getSimplifiedSchema(schema, similarModels)
    console.log(`\n🧬 Selected Models Schema:\n${simplifiedSchema}`);
    return simplifiedSchema;
}