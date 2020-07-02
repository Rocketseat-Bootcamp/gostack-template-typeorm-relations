import { Request, Response } from 'express';

import { container } from 'tsyringe';

import CreateOrderService from '@modules/orders/services/CreateOrderService';
import FindOrderService from '@modules/orders/services/FindOrderService';

export default class OrdersController {
  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const findOrderService = container.resolve(FindOrderService);
    const orders_products = await findOrderService.execute({ id });
    return response.json(orders_products);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { products, customer_id } = request.body;
    const createOrderService = container.resolve(CreateOrderService);
    var orders_products = await createOrderService.execute({ products, customer_id })
    return response.json(orders_products);
  }
}
