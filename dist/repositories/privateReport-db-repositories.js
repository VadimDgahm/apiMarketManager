"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.privateReportRepositories = void 0;
const db_1 = require("./db");
exports.privateReportRepositories = {
    getAggregateBriefcase(briefcaseId, deliveryRoutes) {
        return __awaiter(this, void 0, void 0, function* () {
            const matchConditions = { "orders.invoiceOrderItems": { $exists: true, $ne: [] } };
            if (deliveryRoutes && deliveryRoutes.length > 0) {
                matchConditions["orders.deliveryRoute._id"] = {
                    $in: deliveryRoutes
                };
            }
            return yield db_1.briefcaseCollection.aggregate([
                { $match: { id: briefcaseId } },
                { $unwind: "$orders" },
                {
                    $match: matchConditions
                },
                {
                    $lookup: {
                        from: "catalog",
                        let: { productId: "$orders.invoiceOrderItems.productId" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $in: ["$_id", {
                                                $map: {
                                                    input: "$$productId",
                                                    as: "pid",
                                                    in: { $toObjectId: "$$pid" }
                                                }
                                            }]
                                    }
                                }
                            },
                            { $project: { sortValue: 1, view: 1, purchasePrice: 1 } }
                        ],
                        as: "catalogData"
                    }
                },
                {
                    $addFields: {
                        "orders.invoiceOrderItems": {
                            $map: {
                                input: "$orders.invoiceOrderItems",
                                as: "item",
                                in: {
                                    $mergeObjects: [
                                        "$$item",
                                        {
                                            sortValue: {
                                                $ifNull: [
                                                    {
                                                        $arrayElemAt: [
                                                            {
                                                                $map: {
                                                                    input: {
                                                                        $filter: {
                                                                            input: "$catalogData",
                                                                            as: "catalogItem",
                                                                            cond: { $eq: ["$$catalogItem._id", { $toObjectId: "$$item.productId" }] }
                                                                        }
                                                                    },
                                                                    as: "filteredCatalog",
                                                                    in: "$$filteredCatalog.sortValue"
                                                                }
                                                            },
                                                            0
                                                        ]
                                                    },
                                                    0
                                                ]
                                            },
                                            view: {
                                                $ifNull: [
                                                    {
                                                        $arrayElemAt: [
                                                            {
                                                                $map: {
                                                                    input: {
                                                                        $filter: {
                                                                            input: "$catalogData",
                                                                            as: "catalogItem",
                                                                            cond: { $eq: ["$$catalogItem._id", { $toObjectId: "$$item.productId" }] }
                                                                        }
                                                                    },
                                                                    as: "filteredCatalog",
                                                                    in: "$$filteredCatalog.view"
                                                                }
                                                            },
                                                            0
                                                        ]
                                                    },
                                                    null
                                                ]
                                            },
                                            purchasePrice: {
                                                $ifNull: [
                                                    {
                                                        $arrayElemAt: [
                                                            {
                                                                $map: {
                                                                    input: {
                                                                        $filter: {
                                                                            input: "$catalogData",
                                                                            as: "catalogItem",
                                                                            cond: { $eq: ["$$catalogItem._id", { $toObjectId: "$$item.productId" }] }
                                                                        }
                                                                    },
                                                                    as: "filteredCatalog",
                                                                    in: "$$filteredCatalog.purchasePrice"
                                                                }
                                                            },
                                                            0
                                                        ]
                                                    },
                                                    0
                                                ]
                                            }
                                        }
                                    ]
                                }
                            }
                        }
                    }
                },
                {
                    $group: {
                        _id: "$_id",
                        orders: { $push: "$orders" }
                    }
                }
            ]).toArray();
        });
    }
};
//# sourceMappingURL=privateReport-db-repositories.js.map