import { IOrder } from "../interfaces/order.interface";
import { OrderServiceImpl } from "../services/datasources/impl/order.service.impl";

const orderService = new OrderServiceImpl();

export const useOrder = () => {
  const createOrder = async (orderBody: IOrder) => {
    try {
      const response = await orderService.createOrder(orderBody);
      return response;
    } catch (error) {
      return null;
    }
  };
  return {
    createOrder,
  };
};
