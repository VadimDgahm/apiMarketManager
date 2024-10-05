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

        await generateWorksheet(data.data, workbook, 'Продажи');
        await generateWorksheet(data.giftData, workbook, 'Подарки');

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

        const addData = (data: ViewDataMap, item: OrderItemsResponse) => {
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
            }

            data[item.view][item.name].weight += item.weight;
        }

        for (const order of brief[0].orders) {
            if (order.invoiceOrderItems) {
                for (const item of order.invoiceOrderItems) {
                    if (item.isGift) {
                        addData(giftViewData, item);
                    } else {
                        addData(viewData, item);
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
                    productPrice: data[view][name].productPrice
                })).sort((a, b) => a.sortValue - b.sortValue)
            }))
        }

        return {
            data: parseData(viewData),
            giftData: parseData(giftViewData)
        };
    }
};

async function generateWorksheet(data: dataExel[], workbook: ExcelJS.Workbook,nameWorksheet: string) {
    const worksheet = workbook.addWorksheet(nameWorksheet);

    const headerStyle = {
        font: {bold: true},
        alignment: {horizontal: 'center', wrapText: true, vertical: 'middle'}
    };

    const rowStyle = {
        alignment: {vertical: 'middle', horizontal: 'center'}
    };

    data.forEach((viewData, viewIndex) => {
        const {view, products} = viewData;

        worksheet.addRow([view]).font = {bold: true};

        const headers = [
            '№',
            'Позиция',
            'Вес, кг',
            'Цена закупки',
            'Сумма закупа',
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
            {width: 8}, // Ширина для "Вес, кг"
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

        products.forEach((product, index) => {
            const {name, weight, purchasePrice, productPrice} = product;
            const purchaseSum = weight * purchasePrice;
            const salesSum = weight * productPrice;
            const markupValue = productPrice - purchasePrice;
            const markupPercent = (markupValue / purchasePrice) * 100;
            const profit = salesSum - purchaseSum;

            worksheet.addRow([
                index + 1,
                name,
                weight.toFixed(2),
                purchasePrice.toFixed(2),
                purchaseSum.toFixed(2),
                productPrice.toFixed(2),
                salesSum.toFixed(2),
                markupValue.toFixed(2),
                markupPercent.toFixed(2),
                profit.toFixed(2)
            ]).eachCell(cell => {
                // @ts-ignore
                cell.style = rowStyle;
            });

            totalWeight += weight;
            totalPurchase += purchaseSum;
            totalSales += salesSum;
            totalProfit += profit;
        });

        worksheet.addRow([]);

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
            cell.style = {font: {bold: true}, alignment: rowStyle.alignment};
        });

        worksheet.addRow([]);
        worksheet.addRow([]);
        worksheet.addRow([]);
    });
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
}

interface ViewData {
    [name: string]: ProductData;
}

interface ViewDataMap {
    [view: string]: ViewData;
}
