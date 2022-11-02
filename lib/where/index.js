"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.whereCollection = exports.whereFilterEquality = void 0;
const firestore_1 = require("firebase-admin/firestore");
const utils_1 = require("../utils");
const getWhereType = (type) => {
    switch (type) {
        case "equalTo":
            return "==";
        case "notEqualTo":
            return "!=";
        case "lessThan":
            return "<";
        case "lessThanOrEqualTo":
            return "<=";
        case "greaterThan":
            return ">";
        case "greaterThanOrEqualTo":
            return ">=";
        case "in":
            return "in";
        case "notIn":
            return "not-in";
        case "arrayContains":
            return "array-contains";
    }
    return undefined;
};
const isEqualityFilter = (type) => {
    return (!!type &&
        [
            "lessThanOrEqualTo",
            "greaterThanOrEqualTo",
            "greaterThan",
            "lessThan",
        ].includes(type));
};
const whereFilterEquality = (whereInput, data) => {
    return (0, utils_1.ObjectReduce)(whereInput, (acc, fieldName, value) => {
        if (acc === false)
            return false;
        const parsedData = data instanceof firestore_1.Timestamp ? data.toMillis() : data;
        const parsedValue = value instanceof firestore_1.Timestamp ? value.toMillis() : value;
        if (typeof parsedValue === "object" && !(parsedValue instanceof Array)) {
            const curData = data === null || data === void 0 ? void 0 : data[fieldName];
            return (0, exports.whereFilterEquality)(value, curData);
        }
        if (fieldName === "greaterThanOrEqualTo") {
            return parsedData >= parsedValue;
        }
        if (fieldName === "lessThanOrEqualTo") {
            return parsedData <= parsedValue;
        }
        if (fieldName === "lessThan") {
            return parsedData < parsedValue;
        }
        if (fieldName === "greaterThan") {
            return parsedData > parsedValue;
        }
        return acc;
    }, true);
};
exports.whereFilterEquality = whereFilterEquality;
const whereObjectCollection = (parentName, fieldName, whereInput, collection) => {
    return (0, utils_1.ObjectReduce)(whereInput, (acc, operator, whereFieldInput) => {
        if (isEqualityFilter(operator))
            return acc;
        if (whereFieldInput instanceof Array) {
            if (!whereFieldInput.length)
                return acc;
        }
        else if (typeof whereFieldInput === "object") {
            return whereObjectCollection(`${parentName}.${fieldName}`, operator, whereFieldInput, acc);
        }
        const whereOperator = getWhereType(operator);
        return acc.where(`${parentName}.${fieldName}`, whereOperator, whereFieldInput);
    }, collection);
};
const whereCollection = (target, collection, whereInput, withoutID = false) => {
    if (!whereInput)
        return collection;
    let curCollection = collection;
    return (0, utils_1.ObjectReduce)(whereInput, (acc, fieldName, whereFieldInput) => {
        if (!whereFieldInput)
            return acc;
        const field = target.fields[fieldName];
        return (0, utils_1.ObjectReduce)(whereFieldInput, (acc2, operator, value) => {
            if (typeof value === "undefined" || value === null)
                return acc2;
            if (value instanceof Array && !value.length)
                return acc2;
            if (isEqualityFilter(operator))
                return acc2;
            if (field.type === "Object" && typeof value === "object") {
                return whereObjectCollection(fieldName, operator, value, acc2);
            }
            if (typeof value === "object" && operator === "id") {
                const whereField = Object.keys(value).at(0);
                const whereID = Object.values(value).at(0);
                const whereOperator = getWhereType(whereField);
                if (!whereID)
                    return acc2;
                if (field.type === "Pointer" && whereOperator) {
                    const targetCollection = (0, utils_1.getTargetCollection)(field.target, []);
                    const targetDoc = targetCollection.doc(whereID);
                    return acc2.where(fieldName, whereOperator, targetDoc);
                }
                if (field.type === "Relation") {
                    const targetCollection = (0, utils_1.getTargetCollection)(field.target, []);
                    if (whereField === "equalTo") {
                        const targetDoc = targetCollection.doc(whereID);
                        return acc2.where(fieldName, "array-contains", targetDoc);
                    }
                    if (whereField === "in" && whereID instanceof Array) {
                        const targetDocs = whereID.map((id) => targetCollection.doc(id));
                        return acc2.where(fieldName, "in", [
                            targetDocs,
                            Array.from(targetDocs).reverse(),
                        ]);
                    }
                }
            }
            const whereOperator = getWhereType(operator);
            if (!whereOperator)
                return acc2;
            if (operator === "exists") {
                return acc2.where(fieldName, value ? "!=" : "==", null);
            }
            if (fieldName === "id") {
                if (withoutID)
                    return acc2;
                return acc2.where("__name__", whereOperator, value);
            }
            return acc2.where(fieldName, whereOperator, value);
        }, acc);
    }, curCollection);
};
exports.whereCollection = whereCollection;
