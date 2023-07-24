import { parse, print, Kind } from 'graphql';

function getNamedType(node: any): any {
  let namedType = node;
  while (namedType.kind !== Kind.NAMED_TYPE) {
    namedType = namedType.type;
  }
  return namedType;
}

function collectTypes(node: any, types: Set<string>) {
  if (node.type) {
    const typeName = getNamedType(node.type).name.value;
    if (!types.has(typeName)) {
      types.add(typeName);
      // Visit type definitions to collect nested types
      let typeDef = node.root.definitions.find((def: any) => def.kind === Kind.OBJECT_TYPE_DEFINITION && def.name.value === typeName);
      if (typeDef) {
        typeDef.fields.forEach((field: any) => {
          field.root = node.root;
          collectTypes(field, types);
        });
      }
    }
  }
  if (node.selectionSet) {
    for (let selection of node.selectionSet.selections) {
      if (selection.kind === 'Field') {
        selection.root = node.root;
        collectTypes(selection, types);
      }
    }
  }
}
export function getSimplifiedSchema(schemaStr: string, filterList: string[]): string {
  const doc = parse(schemaStr);
  const types = new Set<string>();

  for (let def of doc.definitions) {
    if (def.kind === Kind.OBJECT_TYPE_DEFINITION && def.name.value === 'Query') {
      (def.fields as any) = def.fields.filter((field: any) => filterList.includes(field.name.value));
      def.fields.forEach((field: any) => {
        field.root = doc;
        collectTypes(field, types);
      });
    }
  }

const newDoc = {
  ...doc,
  definitions: doc.definitions.filter(def => {
    return (
      (def.kind === Kind.OBJECT_TYPE_DEFINITION && 
      (def.name.value === 'Query' || types.has((def as any).name.value)))
    );
  })
};

  const newSchemaStr = print(newDoc);
  return newSchemaStr;
}