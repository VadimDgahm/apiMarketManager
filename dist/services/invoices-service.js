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
exports.invoicesService = void 0;
const invoices_db_repositories_1 = require("../repositories/invoices-db-repositories");
const db_1 = require("../repositories/db");
const mongodb_1 = require("mongodb");
exports.invoicesService = {
    getInvoicesById(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield invoices_db_repositories_1.invoicesRepositories.getInvoicesById(id, userId);
        });
    },
    getOrderInvoiceById(briefcaseId, orderId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield invoices_db_repositories_1.invoicesRepositories.getOrderInvoiceById(briefcaseId, orderId, userId);
        });
    },
    createInvoice(body, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const invoiceOrderItems = [];
            let totalAmount = 0;
            for (const item of body.orderItems) {
                const product = yield db_1.catalogCollection.findOne({ _id: new mongodb_1.ObjectId(item.productId) });
                let amount = 0;
                if (!item.isGift) {
                    amount = +(product.price * item.weight).toFixed(2);
                }
                totalAmount += amount;
                invoiceOrderItems.push(Object.assign(Object.assign({}, item), { productPrice: product.price, name: product.name, amount: amount, units: item.units, comments: item.comments }));
            }
            totalAmount = +(totalAmount + body.priceDelivery).toFixed(2);
            const finalTotalAmount = +(totalAmount * (1 - body.discount / 100)).toFixed(2);
            const updatedFields = {
                "orders.$[order].invoiceOrderItems": invoiceOrderItems,
                "orders.$[order].discount": body.discount,
                "orders.$[order].priceDelivery": body.priceDelivery,
                "orders.$[order].markOrder": body.markOrder,
                "orders.$[order].totalAmount": totalAmount,
                "orders.$[order].finalTotalAmount": finalTotalAmount
            };
            const result = yield db_1.briefcaseCollection.updateOne({ "orders.orderId": body.orderId }, { $set: updatedFields }, {
                arrayFilters: [{ "order.orderId": body.orderId }],
                upsert: false
            });
            return result;
        });
    },
    deleteInvoicesByBriefcaseId(briefcaseId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield invoices_db_repositories_1.invoicesRepositories.deleteManyInvoices({ briefcaseId });
        });
    },
    getTotalWeightByBriefcaseId(briefcaseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const brief = yield db_1.briefcaseCollection.aggregate([
                { $match: { id: briefcaseId } },
                { $unwind: "$orders" },
                {
                    $match: { "orders.invoiceOrderItems": { $exists: true, $ne: [] } }
                },
                {
                    $lookup: {
                        from: "catalog",
                        let: { productId: "$orders.invoiceOrderItems.productId" },
                        pipeline: [
                            { $match: { $expr: { $in: ["$_id", { $map: { input: "$$productId", as: "pid", in: { $toObjectId: "$$pid" } } }] } } },
                            { $project: { sortValue: 1, view: 1 } }
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
            const viewData = {};
            for (const order of brief[0].orders) {
                if (order.invoiceOrderItems) {
                    for (const item of order.invoiceOrderItems) {
                        if (!viewData[item.view]) {
                            viewData[item.view] = {};
                        }
                        if (!viewData[item.view][item.name]) {
                            viewData[item.view][item.name] = {
                                sortValue: item.sortValue || 0,
                                weight: 0
                            };
                        }
                        viewData[item.view][item.name].weight += item.weight;
                    }
                }
            }
            return Object.keys(viewData).map(view => ({
                view,
                products: Object.keys(viewData[view]).map(name => ({
                    name,
                    sortValue: viewData[view][name].sortValue,
                    weight: viewData[view][name].weight
                })).sort((a, b) => a.sortValue - b.sortValue)
            }));
        });
    }
};
//# sourceMappingURL=invoices-service.js.map