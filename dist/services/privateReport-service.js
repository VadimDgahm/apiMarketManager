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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.privateReportService = void 0;
const users_db_repositories_1 = require("../repositories/users-db-repositories");
const bcrypt_1 = __importDefault(require("bcrypt"));
const exceljs_1 = __importDefault(require("exceljs"));
const db_1 = require("../repositories/db");
exports.privateReportService = {
    checkPrivatePass(userId, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_db_repositories_1.UsersRepositories.getUser({ id: userId });
            let isPassEquals = false;
            if (user.privatePass) {
                isPassEquals = yield bcrypt_1.default.compare(password, user.privatePass);
            }
            return isPassEquals ? { success: true } : { success: false };
        });
    },
    createPrivateReport(userId, idBriefcase) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.getTotalWeightByBriefcaseId(idBriefcase);
            const workbook = new exceljs_1.default.Workbook();
            yield generateWorksheet(data.data, workbook, 'Продажи');
            yield generateWorksheet(data.giftData, workbook, 'Подарки');
            yield generateWorksheet(data.discountData, workbook, 'Скидки');
            return workbook;
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
            const viewData = {};
            const giftViewData = {};
            const discountData = {};
            const addData = (data, item, config = {
                discount: 0,
                isGift: false
            }) => {
                if (!data[item.view]) {
                    data[item.view] = {};
                }
                if (!data[item.view][item.name]) {
                    data[item.view][item.name] = {
                        sortValue: item.sortValue || 0,
                        weight: 0,
                        purchasePrice: item.purchasePrice,
                        productPrice: item.productPrice
                    };
                    if (config.isGift) {
                        data[item.view][item.name].productPrice = 0;
                    }
                    if (config.discount) {
                        data[item.view][item.name].discount = config.discount;
                    }
                }
                data[item.view][item.name].weight += item.weight;
            };
            for (const order of brief[0].orders) {
                if (order.invoiceOrderItems) {
                    for (const item of order.invoiceOrderItems) {
                        if (item.isGift) {
                            addData(giftViewData, item, { isGift: true });
                        }
                        else if (order.discount) {
                            addData(discountData, item, { discount: order.discount });
                        }
                        else {
                            addData(viewData, item);
                        }
                    }
                }
            }
            const parseData = (data) => {
                return Object.keys(data).map(view => ({
                    view,
                    products: Object.keys(data[view]).map(name => {
                        var _a;
                        return ({
                            name,
                            sortValue: data[view][name].sortValue,
                            weight: data[view][name].weight,
                            purchasePrice: data[view][name].purchasePrice,
                            productPrice: data[view][name].productPrice,
                            discount: (_a = data[view][name].discount) !== null && _a !== void 0 ? _a : 0
                        });
                    }).sort((a, b) => a.sortValue - b.sortValue)
                }));
            };
            const parseData2 = (data, gift, discountData) => {
                return Object.keys(data).map(view => {
                    const res = {
                        view,
                        products: Object.keys(data[view]).map(name => ({
                            name,
                            sortValue: data[view][name].sortValue,
                            weight: data[view][name].weight,
                            purchasePrice: data[view][name].purchasePrice,
                            productPrice: data[view][name].productPrice
                        })).sort((a, b) => a.sortValue - b.sortValue)
                    };
                    if (discountData[view]) {
                        res.products.push(...Object.keys(discountData[view]).map(name => {
                            var _a;
                            return ({
                                name,
                                sortValue: discountData[view][name].sortValue,
                                weight: discountData[view][name].weight,
                                purchasePrice: discountData[view][name].purchasePrice,
                                productPrice: discountData[view][name].productPrice,
                                discount: (_a = discountData[view][name].discount) !== null && _a !== void 0 ? _a : 0
                            });
                        }));
                    }
                    if (gift[view]) {
                        res.products.push(...Object.keys(gift[view]).map(name => ({
                            name,
                            sortValue: gift[view][name].sortValue,
                            weight: gift[view][name].weight,
                            purchasePrice: gift[view][name].purchasePrice,
                            productPrice: gift[view][name].productPrice
                        })));
                    }
                    return res;
                });
            };
            return {
                data: parseData2(viewData, giftViewData, discountData),
                giftData: parseData(giftViewData),
                discountData: parseData(discountData)
            };
        });
    }
};
function generateWorksheet(data, workbook, nameWorksheet) {
    return __awaiter(this, void 0, void 0, function* () {
        const worksheet = workbook.addWorksheet(nameWorksheet);
        const border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
        };
        const headerStyle = {
            font: { bold: true },
            alignment: {
                horizontal: 'center',
                wrapText: true,
                vertical: 'middle',
            },
            border: border
        };
        const rowStyle = {
            alignment: { vertical: 'middle', horizontal: 'center' },
            border: border
        };
        data.forEach((viewData, viewIndex) => {
            const { view, products } = viewData;
            worksheet.addRow([view]).font = { bold: true };
            const headers = [
                '№',
                'Позиция',
                'Вес, кг',
                'Цена закупки',
                'Сумма закупки',
                'Цена продажи',
                'Сумма продажи',
                'Наценка, руб.',
                'Цена наценки, %',
                'Прибыль'
            ];
            const headerRow = worksheet.addRow(headers);
            headerRow.eachCell(cell => {
                //@ts-ignore
                cell.style = headerStyle;
            });
            worksheet.getRow(headerRow.number).height = 30;
            worksheet.columns = [
                { width: 10 }, // Ширина для "№"
                { width: 30 }, // Ширина для "Позиция (name)"
                { width: 8 }, // Ширина для "Вес, кг"
                { width: 13 }, // Ширина для "Цена закупки"
                { width: 13 }, // Ширина для "Сумма закупа"
                { width: 13 }, // Ширина для "Цена продажи"
                { width: 13 }, // Ширина для "Сумма продажи"
                { width: 13 }, // Ширина для "Наценка, руб."
                { width: 13 }, // Ширина для "Цена наценки, %"
                { width: 13 } // Ширина для "Прибыль"
            ];
            let totalWeight = 0;
            let totalPurchase = 0;
            let totalSales = 0;
            let totalProfit = 0;
            products.forEach((product, index) => {
                const { name, weight, purchasePrice, discount } = product;
                if (discount) {
                    product.productPrice *= (100 - discount) / 100;
                }
                const productPrice = product.productPrice;
                const purchaseSum = weight * purchasePrice;
                const salesSum = weight * productPrice;
                const markupValue = productPrice === 0 ? 0 : productPrice - purchasePrice;
                const markupPercent = productPrice === 0 ? 0 : (markupValue / purchasePrice) * 100;
                const profit = salesSum - purchaseSum;
                const productPriceCell = discount ? productPrice.toFixed(2) + ` (${discount}%)` : productPrice.toFixed(2);
                const row = worksheet.addRow([
                    index + 1,
                    name,
                    weight.toFixed(2),
                    purchasePrice.toFixed(2),
                    purchaseSum.toFixed(2),
                    productPriceCell,
                    salesSum.toFixed(2),
                    markupValue.toFixed(2),
                    markupPercent.toFixed(2),
                    profit.toFixed(2)
                ]);
                row.eachCell((cell, colNumber) => {
                    if (productPrice === 0) {
                        // @ts-ignore
                        cell.style = Object.assign(Object.assign({}, rowStyle), { fill: {
                                type: 'pattern',
                                pattern: 'solid',
                                fgColor: { argb: 'ffc0c0' },
                            } });
                    }
                    else if (discount) {
                        // @ts-ignore
                        cell.style = Object.assign(Object.assign({}, rowStyle), { fill: {
                                type: 'pattern',
                                pattern: 'solid',
                                fgColor: { argb: 'b4c7dc' },
                            } });
                    }
                    else {
                        // @ts-ignore
                        cell.style = rowStyle;
                    }
                });
                totalWeight += weight;
                totalPurchase += purchaseSum;
                totalSales += salesSum;
                totalProfit += profit;
            });
            worksheet.addRow(['', '', '', '', '', '', '', '', '', '']).eachCell(cell => {
                // @ts-ignore
                cell.style = rowStyle;
            });
            worksheet.addRow([
                'Итого',
                '',
                totalWeight.toFixed(2),
                '',
                totalPurchase.toFixed(2),
                '',
                totalSales.toFixed(2),
                '',
                view + ': ',
                totalProfit.toFixed(2)
            ]).eachCell((cell, colNumber) => {
                // @ts-ignore
                cell.style = { font: { bold: true }, alignment: rowStyle.alignment, border: border };
            });
            worksheet.addRow([]);
            worksheet.addRow([]);
            worksheet.addRow([]);
        });
    });
}
//# sourceMappingURL=privateReport-service.js.map