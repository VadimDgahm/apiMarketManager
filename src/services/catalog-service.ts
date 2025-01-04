import { clientsRepositories } from "../repositories/clients-db-repositories";
import { QueryResponse } from "../routes/clients-route";
import { v4 as uuidv4 } from "uuid";

import { catalogRepositories } from "../repositories/catalog-db-repositories";

export const catalogService = {
  async getCatalog(userId: string) {
    return await catalogRepositories.getCatalog(userId);
  },
  async createProduct({
    name,
    type,
    userId,
    view,
    reductionName,
    price,
    sortValue,
    typeReceipt
  }: ProductTypeRequest) {
    const body: ProductType = {
      id: uuidv4(),
      name,
      type,
      view,
      userId,
      reductionName,
      price,
      sortValue,
      typeReceipt
    };
    return await catalogRepositories.createProduct(body);
  },
  async removeProduct(id: string, userId: string) {
    return await catalogRepositories.removeProduct(id, userId);
  },
  async changeProduct(
    productId: string,
    userId: string,
    body: ProductTypeRequest
  ) {
    return await catalogRepositories.changeProduct(productId, userId, body);
  },
};

export type ProductTypeRequest = {
  name: string;
  type: "Сырьевой" | "Готовый";
  userId: string;
  view: "Свинина" | "Птица" | "Говядина";
  reductionName: string;
  price: number;
  sortValue: number;
  typeReceipt: "ИП" | "СЗ";
};

export type ProductType = {
  id: string;
} & ProductTypeRequest;
