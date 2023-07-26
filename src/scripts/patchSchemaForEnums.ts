import { parse, print, visit } from 'graphql';

export function patchSchemaForEnums(inputName: string, enumName: string, enumValues: string[], schemaString: string) {
   const schema = parse(schemaString);

  const newSchema = visit(schema, {
    // Handle FieldDefinition
    FieldDefinition(node) {
      // Check if there's any argument with the specified name
      if (node.arguments?.some(arg => arg.name.value === inputName)) {
        // Replace the type of the argument with the specified name
        return {
          ...node,
          arguments: node.arguments.map(arg => {
            if (arg.name.value === inputName && (
              (arg.type.kind === 'NamedType' && arg.type.name.value === 'String') ||
              (arg.type.kind === 'NonNullType' && arg.type.type.kind === 'NamedType' && arg.type.type.name.value === 'String')
            )) {
              return {
                ...arg,
                type: {
                  kind: arg.type.kind,
                  type: {
                    kind: 'NamedType',
                    name: {
                      kind: 'Name',
                      value: enumName,
                    },
                  },
                },
              };
            } else {
              return arg;
            }
          }),
        };
      }
    },
    // Append the new enum definition
    Document: {
      leave(node) {
        return {
          ...node,
          definitions: [
            ...node.definitions,
            {
              kind: 'EnumTypeDefinition',
              name: { kind: 'Name', value: enumName },
              values: enumValues.map(value => ({
                kind: 'EnumValueDefinition',
                name: { kind: 'Name', value },
              })),
              description: null,
              directives: [],
            },
          ],
        };
      },
    },
  });

  const newSchemaString = print(newSchema);
  return newSchemaString;
}
