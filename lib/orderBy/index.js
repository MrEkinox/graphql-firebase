"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderByCollection = exports.OrderByEnum = void 0;
const utils_1 = require("../utils");
var OrderByEnum;
(function (OrderByEnum) {
    OrderByEnum["asc"] = "asc";
    OrderByEnum["desc"] = "desc";
})(OrderByEnum = exports.OrderByEnum || (exports.OrderByEnum = {}));
const orderByCollection = (collection, orderByInput) => {
    if (!orderByInput)
        return collection;
    return (0, utils_1.ObjectReduce)(orderByInput, (acc, fieldName, fieldOrder) => {
        return acc.orderBy(fieldName, fieldOrder);
    }, collection);
};
exports.orderByCollection = orderByCollection;
