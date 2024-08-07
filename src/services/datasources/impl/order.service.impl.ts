import { IOrder } from "../../../interfaces/order.interface";
import api from "../../infrastructure/axios-config";
import { OrderService } from "../order.service";

export class OrderServiceImpl implements OrderService {
  private SERVICE_PATH_ORDERS = "/post";

  async createOrder(orderBody: IOrder): Promise<any> {
    try {
      const response: any = await api.post(
        `${this.SERVICE_PATH_ORDERS}`,
        orderBody
      );
      return response.data?.data;
    } catch (err) {
      throw new Error("Could not create order");
    }
  }
}
