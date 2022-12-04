import { core } from "nexus";
import { NexusOutputFieldConfig } from "nexus/dist/core";
export declare type ReferenceField = Omit<core.NexusOutputFieldConfig<string, string>, "args">;
export declare type ObjectField = core.NexusOutputFieldConfig<string, string>;
export declare type CollectionField = NexusOutputFieldConfig<string, string> & Omit<core.connectionPluginCore.ConnectionFieldConfig<string, string>, "resolve">;
export declare const LogTimePlugin: (enabled?: boolean) => core.NexusPlugin;
export declare const GraphQLFirebasePlugin: () => core.NexusPlugin;
