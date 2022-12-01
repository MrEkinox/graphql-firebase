import { firestore } from "firebase-admin";
import { fieldsList } from "graphql-fields-list";
import { plugin, arg, dynamicOutputMethod, core } from "nexus";
import { NexusOutputFieldConfig } from "nexus/dist/core";
import { getCollection } from "../mutations";
import { WhereCollection } from "../where";

export type ReferenceField = Omit<
  core.NexusOutputFieldConfig<any, string>,
  "args"
>;

export type ObjectField = core.NexusOutputFieldConfig<any, string>;

export type CollectionField = NexusOutputFieldConfig<any, string> &
  core.connectionPluginCore.ConnectionFieldConfig<any, any>;

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
            const filedName = config.args[0];
            t.field(filedName, {
              ...config.args[1],
              list: undefined,
              resolve: async (src, args, ctx, info) => {
                if (config.args[1].list) {
                  const refs: firestore.DocumentReference[] = src[filedName];
                  if (refs?.length) {
                    const snapshot = await firestore().getAll(...refs);
                    return snapshot.map((doc) => doc.data());
                  }
                  return [];
                }
                const ref: firestore.DocumentReference = src[filedName];
                if (!ref) return null;
                const snapshot = await ref.get();
                return snapshot.data();
              },
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
            t.connectionField(filedName, {
              ...config.args[1],
              getConnectionName: () => `${type}Collection`,
              type,
              additionalArgs: {
                ...config.args[1].additionalArgs,
                limit: arg({ type: "Int", default: 50 }),
                offset: arg({ type: "Int", default: 0 }),
                where: arg({ type: `${type}WhereInput` }),
              },
              resolve: async (src, { where, limit, offset }, ctx, info) => {
                const fields = fieldsList(info, { path: "edges.node" });
                let collection = getCollection(
                  type,
                  src && [{ name: info.parentType.name, id: src.id }]
                ).select(...fields);

                if (where) {
                  const whereCollection = new WhereCollection(info.schema);
                  const ids = await whereCollection.get(type, where);
                  if (!ids.length) return { edges: [] };
                  collection = collection.where("id", "in", ids);
                }

                if (typeof limit === "number") {
                  collection = collection.limit(limit);
                }
                if (typeof offset === "number") {
                  collection = collection.offset(offset);
                }

                const data = await collection.get();

                const edges = data.docs.map((doc) => ({
                  node: { id: doc.id, ...doc.data() },
                }));

                return { edges };
              },
            });
          },
        })
      );
    },
  });
};
