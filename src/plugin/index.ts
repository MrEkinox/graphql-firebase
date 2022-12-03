import { firestore } from "firebase-admin";
import { fieldsList } from "graphql-fields-list";
import { plugin, arg, dynamicOutputMethod, core } from "nexus";
import { idArg, NexusOutputFieldConfig } from "nexus/dist/core";
import { getCollection, getParentIds } from "../mutations";
import { WhereCollection } from "../where";
import chunk from "lodash/chunk";
import { firstLowercase, getParentIdLabel } from "../utils";
import { collectionResolver } from "../collection";
import { referenceResolver } from "../reference";

export type ReferenceField = Omit<
  core.NexusOutputFieldConfig<string, string>,
  "args"
>;

export type ObjectField = core.NexusOutputFieldConfig<string, string>;

export type CollectionField = NexusOutputFieldConfig<string, string> &
  Omit<
    core.connectionPluginCore.ConnectionFieldConfig<string, string>,
    "resolve"
  >;

export const LogTimePlugin = (enabled?: boolean) =>
  plugin({
    name: "LogTimePlugin",
    onCreateFieldResolver(config) {
      if (enabled)
        return async (root, args, ctx, info, next) => {
          const startTimeMs = new Date().valueOf();
          const value = await next(root, args, ctx, info);
          const endTimeMs = new Date().valueOf();
          console.log(
            `${config.parentTypeConfig.name} ${
              info.operation.name?.value
            } took ${endTimeMs - startTimeMs} ms`
          );
          return value;
        };
      return undefined;
    },
  });

export const GraphQLFirebasePlugin = () => {
  return plugin({
    name: "GraphQL-Firebase",
    fieldDefTypes: [
      core.printedGenTypingImport({
        module: __dirname,
        bindings: ["ReferenceField, CollectionField", "ObjectField"],
      }),
    ],
    onMissingType(missingTypeName, builder) {
      console.log({ missingTypeName });
    },
    onInstall: (builder) => {
      builder.addType(
        dynamicOutputMethod({
          name: "ref",
          typeDefinition: `<FieldName extends string>(name: FieldName, config: ReferenceField): void`,
          factory: ({ typeName, typeDef: t, ...config }) => {
            const fieldName = config.args[0];
            const isList = config.args[1].list;
            t.field(fieldName, {
              resolve: async (src, args, ctx, info) => {
                return referenceResolver(fieldName, isList, src, info);
              },
              ...config.args[1],
            });
          },
        })
      );
      builder.addType(
        dynamicOutputMethod({
          name: "object",
          typeDefinition: `<FieldName extends string>(name: FieldName, config: ObjectField): void`,
          factory: ({ typeName, typeDef: t, ...config }) => {
            const filedName = config.args[0];
            t.field(filedName, config.args[1]);
          },
        })
      );
      builder.addType(
        dynamicOutputMethod({
          name: "collection",
          typeDefinition: `<FieldName extends string>(name: FieldName, config: CollectionField): void`,
          factory: ({ typeName, typeDef: t, ...config }) => {
            const filedName = config.args[0];
            const type = config.args[1].type;
            const parents = config.args[1]?.parents || [];

            t.connectionField(filedName, {
              getConnectionName: () => `${type}Collection`,
              resolve: async (src, input, ctx, info) => {
                return collectionResolver(type, parents, src, input, info);
              },
              ...config.args[1],
              type,
              additionalArgs: {
                ...config.args[1].additionalArgs,
                limit: arg({ type: "Int", default: 50 }),
                offset: arg({ type: "Int", default: 0 }),
                where: arg({ type: `${type}WhereInput` }),
              },
            });
          },
        })
      );
    },
  });
};