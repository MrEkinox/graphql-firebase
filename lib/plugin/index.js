"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLFirebasePlugin = exports.LogTimePlugin = void 0;
const nexus_1 = require("nexus");
const collection_1 = require("../collection");
const reference_1 = require("../reference");
const LogTimePlugin = (enabled) => (0, nexus_1.plugin)({
    name: "LogTimePlugin",
    onCreateFieldResolver(config) {
        if (enabled)
            return async (root, args, ctx, info, next) => {
                var _a;
                const startTimeMs = new Date().valueOf();
                const value = await next(root, args, ctx, info);
                const endTimeMs = new Date().valueOf();
                console.log(`${config.parentTypeConfig.name} ${(_a = info.operation.name) === null || _a === void 0 ? void 0 : _a.value} took ${endTimeMs - startTimeMs} ms`);
                return value;
            };
        return undefined;
    },
});
exports.LogTimePlugin = LogTimePlugin;
const GraphQLFirebasePlugin = () => {
    return (0, nexus_1.plugin)({
        name: "GraphQL-Firebase",
        fieldDefTypes: [
            nexus_1.core.printedGenTypingImport({
                module: __dirname,
                bindings: ["ReferenceField, CollectionField", "ObjectField"],
            }),
        ],
        onMissingType(missingTypeName, builder) {
            console.log({ missingTypeName });
        },
        onInstall: (builder) => {
            builder.addType((0, nexus_1.dynamicOutputMethod)({
                name: "ref",
                typeDefinition: `<FieldName extends string>(name: FieldName, config: ReferenceField): void`,
                factory: (_a) => {
                    var { typeName, typeDef: t } = _a, config = __rest(_a, ["typeName", "typeDef"]);
                    const fieldName = config.args[0];
                    const isList = config.args[1].list;
                    t.field(fieldName, Object.assign({ resolve: async (src, args, ctx, info) => {
                            return (0, reference_1.referenceResolver)(fieldName, isList, src, info);
                        } }, config.args[1]));
                },
            }));
            builder.addType((0, nexus_1.dynamicOutputMethod)({
                name: "object",
                typeDefinition: `<FieldName extends string>(name: FieldName, config: ObjectField): void`,
                factory: (_a) => {
                    var { typeName, typeDef: t } = _a, config = __rest(_a, ["typeName", "typeDef"]);
                    const filedName = config.args[0];
                    t.field(filedName, config.args[1]);
                },
            }));
            builder.addType((0, nexus_1.dynamicOutputMethod)({
                name: "collection",
                typeDefinition: `<FieldName extends string>(name: FieldName, config: CollectionField): void`,
                factory: (_a) => {
                    var _b;
                    var { typeName, typeDef: t } = _a, config = __rest(_a, ["typeName", "typeDef"]);
                    const filedName = config.args[0];
                    const type = config.args[1].type;
                    const parents = ((_b = config.args[1]) === null || _b === void 0 ? void 0 : _b.parents) || [];
                    t.connectionField(filedName, Object.assign(Object.assign({ getConnectionName: () => `${type}Collection`, resolve: async (src, input, ctx, info) => {
                            return (0, collection_1.collectionResolver)(type, parents, src, input, info);
                        } }, config.args[1]), { type, additionalArgs: Object.assign(Object.assign({}, config.args[1].additionalArgs), { limit: (0, nexus_1.arg)({ type: "Int", default: 50 }), offset: (0, nexus_1.arg)({ type: "Int", default: 0 }), where: (0, nexus_1.arg)({ type: `${type}WhereInput` }) }) }));
                },
            }));
        },
    });
};
exports.GraphQLFirebasePlugin = GraphQLFirebasePlugin;
