import {briefcaseCollection} from "./db";
import {ObjectId} from "mongodb";

export const privateReportRepositories = {
    async getAggregateBriefcase(briefcaseId: string, deliveryRoutes ?: string[]) {
        const matchConditions: any = {"orders.invoiceOrderItems": {$exists: true, $ne: []}};

        if (deliveryRoutes && deliveryRoutes.length > 0) {
            matchConditions["orders.deliveryRoute._id"] = {
                $in: deliveryRoutes
            };
        }

        return await briefcaseCollection.aggregate([
            {$match: { id: briefcaseId }},
            {$unwind: "$orders"},
            {
                $match: matchConditions
            },
            {
                $lookup: {
                    from: "catalog",
                    let: {productId: "$orders.invoiceOrderItems.productId"},
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $in: ["$_id", {
                                        $map: {
                                            input: "$$productId",
                                            as: "pid",
                                            in: {$toObjectId: "$$pid"}
                                        }
                                    }]
                                }
                            }
                        },
                        {$project: {sortValue: 1, view: 1, purchasePrice: 1}}
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
                                                                        cond: {$eq: ["$$catalogItem._id", {$toObjectId: "$$item.productId"}]}
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
                                                                        cond: {$eq: ["$$catalogItem._id", {$toObjectId: "$$item.productId"}]}
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
                                                                        cond: {$eq: ["$$catalogItem._id", {$toObjectId: "$$item.productId"}]}
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
                    orders: {$push: "$orders"}
                }
            }
        ]).toArray();
    }
}
