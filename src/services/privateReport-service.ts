import {UsersRepositories} from "../repositories/users-db-repositories";
import bcrypt from "bcrypt";
import ExcelJS from "exceljs";
import {briefcaseCollection} from "../repositories/db";
import {OrderItemsResponse} from "./invoices-service";

export const privateReportService = {
    async checkPrivatePass(userId: string, password: string) {
        const user = await UsersRepositories.getUser({id: userId});
        let isPassEquals = false;

        if (user.privatePass) {
            isPassEquals = await bcrypt.compare(password, user.privatePass);
        }

        return isPassEquals ? {success: true} : {success: false};
    },

    async createPrivateReport(userId: string, idBriefcase: string) {
        const data = await this.getTotalWeightByBriefcaseId(idBriefcase);
        const workbook = new ExcelJS.Workbook();

        await generateWorksheet(data.data, workbook, 'Продажи', data.totalDelivery);
        await generateWorksheet(data.giftData, workbook, 'Подарки');
        await generateWorksheet(data.discountData, workbook, 'Скидки');

        return workbook;
    },

    async getTotalWeightByBriefcaseId(briefcaseId: string) {
        const brief = await briefcaseCollection.aggregate([
            {$match: {id: briefcaseId}},
            {$unwind: "$orders"},
            {
                $match: {"orders.invoiceOrderItems": {$exists: true, $ne: []}}
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

        const viewData: ViewDataMap = {};
        const giftViewData: ViewDataMap = {};
        const discountData: ViewDataMap = {};
        const totalDelivery = {amount:0}


        const addData = (data: ViewDataMap, item: OrderItemsResponse, config: Config = {
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
        }

        for (const order of brief[0].orders) {
            if (order.invoiceOrderItems) {
                for (const item of order.invoiceOrderItems) {
                    if (item.isGift) {
                        addData(giftViewData, item, {isGift: true});
                    } else if (order.discount) {
                        addData(discountData, item, {discount: order.discount});
                    } else {
                        addData(viewData, item);
                    }
                }

                if(order.priceDelivery) {
                    if(order.discount) {
                        totalDelivery.amount += +(order.priceDelivery * ((100 - order.discount)/100)).toFixed(2);
                    } else {
                        totalDelivery.amount += +order.priceDelivery;
                    }
                }
            }
        }

        const parseData = (data: ViewDataMap) => {
            return Object.keys(data).map(view => ({
                view,
                products: Object.keys(data[view]).map(name => ({
                    name,
                    sortValue: data[view][name].sortValue,
                    weight: data[view][name].weight,
                    purchasePrice: data[view][name].purchasePrice,
                    productPrice: data[view][name].productPrice,
                    discount: data[view][name].discount ?? 0
                })).sort((a, b) => a.sortValue - b.sortValue)
            }))
        }

        const parseData3 = (data: ViewDataMap, gift: ViewDataMap, discountData: ViewDataMap) => {
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
                }

                if (discountData[view]) {
                    res.products.push(...Object.keys(discountData[view]).map(name => ({
                        name,
                        sortValue: discountData[view][name].sortValue,
                        weight: discountData[view][name].weight,
                        purchasePrice: discountData[view][name].purchasePrice,
                        productPrice: discountData[view][name].productPrice,
                        discount: discountData[view][name].discount ?? 0
                    })));
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
            })
        }

        return {
            data: parseData3(viewData, giftViewData, discountData),
            giftData: parseData(giftViewData),
            discountData: parseData(discountData),
            totalDelivery: totalDelivery.amount
        };
    }
};

async function generateWorksheet(data: dataExel[], workbook: ExcelJS.Workbook, nameWorksheet: string, totaldelivery = 0) {
    const worksheet = workbook.addWorksheet(nameWorksheet);

    const border = {
        top: {style: 'thin'},
        left: {style: 'thin'},
        bottom: {style: 'thin'},
        right: {style: 'thin'},
    };

    const headerStyle = {
        font: {bold: true},
        alignment: {
            horizontal: 'center',
            wrapText: true,
            vertical: 'middle',
        },
        border: border
    };

    const rowStyle = {
        alignment: {vertical: 'middle', horizontal: 'center'},
        border: border
    };

    const fullTotals = {
        purchases: 0,
        sales: 0,
        profit: 0,
        markupPercent: 0,
        gifts: 0
    };


    data.forEach((viewData, viewIndex) => {
        const {view, products} = viewData;

        const titleRow = worksheet.addRow([view]);

        titleRow.font = {bold: true, size: 16, color: {argb: 'FFFFFFFF'}};
        titleRow.alignment = {
            vertical: 'middle',
            horizontal: 'center'
        };
        titleRow.getCell(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '51382f' }
        };
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

        const headerRow = worksheet.addRow(headers)

        headerRow.eachCell(cell => {
            //@ts-ignore
            cell.style = headerStyle;
        });

        worksheet.getRow(headerRow.number).height = 30;

        worksheet.columns = [
            {width: 10},  // Ширина для "№"
            {width: 30}, // Ширина для "Позиция (name)"
            {width: 9}, // Ширина для "Вес, кг"
            {width: 13}, // Ширина для "Цена закупки"
            {width: 13}, // Ширина для "Сумма закупа"
            {width: 13}, // Ширина для "Цена продажи"
            {width: 13}, // Ширина для "Сумма продажи"
            {width: 13}, // Ширина для "Наценка, руб."
            {width: 13}, // Ширина для "Цена наценки, %"
            {width: 13}  // Ширина для "Прибыль"
        ];

        let totalWeight = 0;
        let totalPurchase = 0;
        let totalSales = 0;
        let totalProfit = 0;
        let totalMarkupPercent = 0;

        products.forEach((product, index) => {
            const {name, weight, purchasePrice, discount} = product;
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

            if(productPrice === 0) {
                fullTotals.gifts += +profit.toFixed(2);
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
                    cell.style = {
                        ...rowStyle,
                        fill: {
                            type: 'pattern',
                            pattern: 'solid',
                            fgColor: {argb: 'ffc0c0'},
                        }
                    };
                } else if (discount) {
                    // @ts-ignore
                    cell.style = {
                        ...rowStyle,
                        fill: {
                            type: 'pattern',
                            pattern: 'solid',
                            fgColor: {argb: 'b4c7dc'},
                        }
                    };
                } else {
                    // @ts-ignore
                    cell.style = rowStyle;
                }
            });

            totalWeight += weight;
            totalPurchase += +purchaseSum.toFixed(2);
            totalSales += +salesSum.toFixed(2);
            totalProfit += +profit.toFixed(2);
            totalMarkupPercent += +markupPercent.toFixed(2);
        });

        totalMarkupPercent = +(totalMarkupPercent /  products.length).toFixed(2);
        fullTotals.markupPercent += totalMarkupPercent;
        fullTotals.purchases += totalPurchase;
        fullTotals.sales +=  totalSales;
        fullTotals.profit += totalProfit;

        worksheet.addRow(['', '', '', '', '', '', '', '', '', view]).eachCell(cell => {
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
            cell.style = {font: {bold: true}, alignment: rowStyle.alignment, border: border};
        });

        worksheet.addRow([]);
        worksheet.addRow([]);
        worksheet.addRow([]);
    });

    worksheet.addRow(['', 'Общая закупка, руб: ', fullTotals.purchases]);
    worksheet.addRow(['', 'Общая продажа, руб: ', fullTotals.sales]);
    worksheet.addRow(['', 'Общая наценка, %: ', fullTotals.markupPercent]);
    worksheet.addRow(['', 'Сумма подарков, руб: ', fullTotals.gifts]);
    worksheet.addRow(['', 'Общая прибыль, руб.: ', fullTotals.profit]);
    worksheet.addRow([]);
    worksheet.addRow(['', 'Сумма за доставку, руб.: ', totaldelivery]);
    worksheet.addRow(['', 'Общая прибыль, руб.: ', fullTotals.profit + totaldelivery]);
}

interface Config {
    discount?: number;
    isGift?: boolean;
}

interface dataExel {
    view: string,
    products: ProductData[]
}

interface ProductData {
    name?: string;
    sortValue: number;
    weight: number;
    purchasePrice: number;
    productPrice: number;
    discount?: number;
}

interface ViewData {
    [name: string]: ProductData;
}

interface ViewDataMap {
    [view: string]: ViewData;
}
