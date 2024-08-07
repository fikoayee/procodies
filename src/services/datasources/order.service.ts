import { IOrder } from "../../interfaces/order.interface";
export interface OrderService {
  createOrder(orderBody: IOrder): Promise<any>;
}
