import openApiResolver from 'openapi-resolver';

const spec = await openApiResolver('../../openapi/index.yml');

Bun.write("./data/api.json", JSON.stringify(spec, null, 4))