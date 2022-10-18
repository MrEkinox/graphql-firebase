import { ParsedCollectionOptions } from "../parser";
export declare const getMutations: (collection: ParsedCollectionOptions, parentIds?: string[]) => {
    createMutation: import("nexus/dist/core").NexusExtendTypeDef<"Mutation">;
    updateMutation: import("nexus/dist/core").NexusExtendTypeDef<"Mutation">;
    deleteMutation: import("nexus/dist/core").NexusExtendTypeDef<"Mutation">;
};
