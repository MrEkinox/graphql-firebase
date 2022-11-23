"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pointerFromFirestore = exports.pointerToFirestore = void 0;
const utils_1 = require("../../utils");
const __1 = require("..");
const where_1 = require("../../where");
const collection_1 = require("../collection");
const pointerToFirestore = async (input, targetName, batch) => {
    const target = (0, utils_1.getTarget)(targetName);
    const targetCollection = (0, utils_1.getTargetCollection)(targetName, []);
    if (input === null || input === void 0 ? void 0 : input.createAndLink) {
        const docRef = targetCollection.doc();
        const data = await (0, __1.targetToFirestore)(target, input.createAndLink, batch, docRef);
        batch.set(docRef, Object.assign(Object.assign({}, data), { id: docRef.id, createdAt: new Date(), updatedAt: new Date() }));
        return docRef;
    }
    if (input === null || input === void 0 ? void 0 : input.link) {
        return targetCollection.doc(input.link);
    }
    return null;
};
exports.pointerToFirestore = pointerToFirestore;
const pointerFromFirestore = async (ref, targetName, whereInput) => {
    if (!ref)
        return null;
    const target = (0, utils_1.getTarget)(targetName);
    const targetCollection = (0, utils_1.getTargetCollection)(targetName, []);
    const collection = (0, where_1.whereCollection)(target, targetCollection, whereInput).where("__name__", "==", ref);
    const documents = await collection.limit(1).get();
    const document = documents.docs[0];
    if (whereInput && !document)
        throw new Error("no where");
    return (0, collection_1.collectionTargetFromFirestore)(document, target);
};
exports.pointerFromFirestore = pointerFromFirestore;
