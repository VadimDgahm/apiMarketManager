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
const privateReport_db_repositories_1 = require("../repositories/privateReport-db-repositories");
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
    createPrivateReport(userId, idBriefcase, deliveryRoutes) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.getTotalWeightByBriefcaseId(idBriefcase, deliveryRoutes);
            const workbook = new exceljs_1.default.Workbook();
            yield generateWorksheet(data.allData, workbook, 'Продажи', data.totalDelivery, data.totalOrders.sale);
            yield generateWorksheet(data.giftData, workbook, 'Подарки', 0, data.totalOrders.gift);
            yield generateWorksheet(data.discountData, workbook, 'Скидки', 0, data.totalOrders.discount);
            return workbook;
        });
    },
    getTotalWeightByBriefcaseId(briefcaseId, deliveryRoutes) {
        return __awaiter(this, void 0, void 0, function* () {
            const brief = yield privateReport_db_repositories_1.privateReportRepositories.getAggregateBriefcase(briefcaseId, deliveryRoutes);
            const saleData = [];
            const giftViewData = [];
            const discountData = [];
            const totalDelivery = { amount: 0 };
            const totalOrders = {
                sale: 0,
                gift: 0,
                discount: 0,
            };
            const addData = (data, item, discount) => {
                var _a;
                let objData = data.find((vData) => vData.view === item.view);
                let index = 0;
                if (!objData) {
                    index = data.push({
                        view: item.view,
                        products: []
                    });
                    objData = data[index - 1];
                }
                if (item.isGift) {
                    discount = 0;
                    item.productPrice = 0;
                }
                const product = (_a = objData.products) === null || _a === void 0 ? void 0 : _a.find((prod) => prod.name === item.name && prod.productPrice === item.productPrice && prod.discount === discount);
                if (!product) {
                    objData.products.push({
                        name: item.name,
                        purchasePrice: item.purchasePrice,
                        productPrice: item.productPrice,
                        weight: item.weight,
                        discount: discount,
                        isGift: item.isGift,
                        sortValue: item.sortValue
                    });
                }
                else {
                    product.weight += item.weight;
                }
            };
            for (const order of brief[0].orders) {
                if (order.invoiceOrderItems) {
                    let includesGift = false;
                    for (const item of order.invoiceOrderItems) {
                        if (item.isGift) {
                            addData(giftViewData, item, order.discount);
                            includesGift = true;
                        }
                        else if (order.discount) {
                            addData(discountData, item, order.discount);
                        }
                        else {
                            addData(saleData, item, order.discount);
                        }
                    }
                    if (order.priceDelivery) {
                        if (order.discount) {
                            totalDelivery.amount += +(order.priceDelivery * ((100 - order.discount) / 100)).toFixed(2);
                        }
                        else {
                            totalDelivery.amount += +order.priceDelivery;
                        }
                    }
                    totalOrders.sale++;
                    if (includesGift) {
                        totalOrders.gift++;
                    }
                    if (order.discount) {
                        totalOrders.discount++;
                    }
                }
            }
            function mergeData(arr1, arr2, arr3) {
                return [...arr1, ...arr2, ...arr3].reduce((acc, current) => {
                    const foundView = acc.find((item) => item.view === current.view);
                    if (foundView) {
                        foundView.products.push(...current.products);
                    }
                    else {
                        acc.push(Object.assign({}, current));
                    }
                    return acc;
                }, []);
            }
            function sortProducts(data) {
                data.forEach(viewItem => viewItem.products.sort((a, b) => a.sortValue - b.sortValue));
            }
            sortProducts(saleData);
            sortProducts(giftViewData);
            sortProducts(discountData);
            return {
                allData: mergeData(saleData, discountData, giftViewData),
                giftData: giftViewData,
                discountData: discountData,
                totalDelivery: totalDelivery.amount,
                totalOrders: totalOrders
            };
        });
    }
};
function generateWorksheet(data, workbook, nameWorksheet, totalDelivery = 0, totalOrders = 0) {
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
        const titleTable = {
            font: {
                bold: true,
                size: 16,
                color: { argb: 'FFFFFFFF' }
            },
            alignment: {
                vertical: 'middle',
                horizontal: 'center'
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: '51382f' }
            }
        };
        const fullTotals = {
            purchases: 0,
            sales: 0,
            profit: 0,
            markupPercent: 0,
            markupPercentWithAction: 0,
            gifts: 0,
        };
        data.forEach((viewData) => {
            const { view, products } = viewData;
            const titleRow = worksheet.addRow([view]);
            //@ts-ignore
            titleRow.getCell(1).style = titleTable;
            const rowNumber = titleRow.number;
            worksheet.mergeCells(`${'A' + rowNumber}:${'J' + rowNumber}`);
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
                { width: 9 }, // Ширина для "Вес, кг"
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
            let totalMarkupPercent = 0;
            let countPromotions = 0;
            let totalMarkupPercentWithAction = 0;
            products.forEach((product, index) => {
                const { name, weight, purchasePrice, discount } = product;
                let productPrice = product.productPrice;
                if (discount) {
                    productPrice *= (100 - discount) / 100;
                    countPromotions++;
                }
                const purchaseSum = weight * purchasePrice;
                const salesSum = weight * productPrice;
                const markupValue = productPrice === 0 ? 0 : productPrice - purchasePrice;
                const markupPercent = productPrice === 0 ? 0 : (markupValue / purchasePrice) * 100;
                const profit = salesSum - purchaseSum;
                const productPriceCell = discount ? productPrice.toFixed(2) + ` (${discount}%)` : productPrice.toFixed(2);
                if (productPrice === 0) {
                    fullTotals.gifts += +profit.toFixed(2);
                    countPromotions++;
                }
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
                totalPurchase += +purchaseSum.toFixed(2);
                totalSales += +salesSum.toFixed(2);
                totalProfit += +profit.toFixed(2);
                totalMarkupPercent += discount ? 0 : +markupPercent.toFixed(2);
                totalMarkupPercentWithAction += +markupPercent.toFixed(2);
            });
            totalMarkupPercent = +(totalMarkupPercent / (products.length - countPromotions)).toFixed(2);
            totalMarkupPercentWithAction = +(totalMarkupPercentWithAction / products.length).toFixed(2);
            fullTotals.markupPercent += totalMarkupPercent;
            fullTotals.markupPercentWithAction += totalMarkupPercentWithAction;
            fullTotals.purchases += totalPurchase;
            fullTotals.sales += totalSales;
            fullTotals.profit += totalProfit;
            worksheet.addRow(['', '', '', '', '', '', '', '', totalMarkupPercentWithAction + ' (A)', view]).eachCell(cell => {
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
                totalMarkupPercent.toFixed(2),
                totalProfit.toFixed(2)
            ]).eachCell((cell, colNumber) => {
                // @ts-ignore
                cell.style = { font: { bold: true }, alignment: rowStyle.alignment, border: border };
            });
            worksheet.addRow([]);
            worksheet.addRow([]);
            worksheet.addRow([]);
        });
        worksheet.addRow([]);
        const totalTitleRow = worksheet.addRow(['', 'Итоги недели']);
        const rowNumber = totalTitleRow.number;
        //@ts-ignore
        totalTitleRow.getCell(2).style = titleTable;
        worksheet.mergeCells(`${'B' + rowNumber}:${'C' + rowNumber}`);
        const addStyledRow = (data) => {
            const row = worksheet.addRow(data);
            row.eachCell((cell, cellIndex) => {
                if (cellIndex !== 1) {
                    //@ts-ignore
                    cell.style = rowStyle;
                }
            });
        };
        addStyledRow(['', 'Количество заказов: ', totalOrders]);
        addStyledRow(['', 'Общая закупка, руб: ', fullTotals.purchases]);
        addStyledRow(['', 'Общая продажа, руб: ', fullTotals.sales]);
        addStyledRow(['', 'Общая наценка, %: ', +(fullTotals.markupPercent / data.length).toFixed(2)]);
        addStyledRow(['', 'Общая наценка (акции), %: ', +(fullTotals.markupPercentWithAction / data.length).toFixed(2)]);
        addStyledRow(['', 'Сумма подарков, руб: ', fullTotals.gifts]);
        addStyledRow(['', 'Общая прибыль, руб.: ', fullTotals.profit]);
        addStyledRow(['', '', '']);
        addStyledRow(['', 'Сумма за доставку, руб.: ', totalDelivery]);
        addStyledRow(['', 'Общая прибыль, руб.: ', fullTotals.profit + totalDelivery]);
    });
}
//# sourceMappingURL=privateReport-service.js.map