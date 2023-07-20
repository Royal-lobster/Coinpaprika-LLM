import openApiResolver from 'openapi-resolver';
const spec = await openApiResolver('src/data/openapi/index.yml');

const stringifiedSpec = JSON.stringify(spec, null, 4)

process.stdout.write(stringifiedSpec)