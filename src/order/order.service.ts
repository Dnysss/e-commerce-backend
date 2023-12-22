import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { Repository } from 'typeorm';
import { CreateOrderDTO } from './dtos/create-order.dto';
import { PaymentService } from '../payment/payment.service';
import { PaymentEntity } from '../payment/entities/payment.entity';
import { CartService } from '../cart/cart.service';
import { OrderProductService } from '../order-product/order-product.service';
import { ProductService } from '../product/product.service';
import { OrderProductEntity } from '../order-product/entities/order-product.entity';
import { CartEntity } from '../cart/entities/cart.entity';
import { ProductEntity } from '../product/entities/product.entity';

import * as fs from 'fs';
import * as PDFDocument from 'pdfkit';
@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    private readonly paymentService: PaymentService,
    private readonly cartService: CartService,
    private readonly orderProductService: OrderProductService,
    private readonly productService: ProductService,
  ) {}

  async saveOrder(
    createOrderDTO: CreateOrderDTO,
    userId: number,
    payment: PaymentEntity,
  ): Promise<OrderEntity> {
    return this.orderRepository.save({
      addressId: createOrderDTO.addressId,
      date: new Date(),
      paymentId: payment.id,
      userId,
    });
  }

  async createOrderProductUsingCart(
    cart: CartEntity,
    orderId: number,
    products: ProductEntity[],
  ): Promise<OrderProductEntity[]> {
    return Promise.all(
      cart.cartProduct?.map((cartProduct) =>
        this.orderProductService.createOrderProduct(
          cartProduct.productId,
          orderId,
          products.find((product) => product.id === cartProduct.productId)
            ?.price || 0,
          cartProduct.amount,
        ),
      ),
    );
  }

  async createOrder(
    createOrderDTO: CreateOrderDTO,
    userId: number,
  ): Promise<OrderEntity> {
    const cart = await this.cartService.findCartByUserId(userId, true);

    const products = await this.productService.findAll(
      cart.cartProduct?.map((cartProduct) => cartProduct.productId),
    );

    const payment: PaymentEntity = await this.paymentService.createPayment(
      createOrderDTO,
      products,
      cart,
    );

    const order = await this.saveOrder(createOrderDTO, userId, payment);

    await this.createOrderProductUsingCart(cart, order.id, products);

    await this.cartService.clearCart(userId);

    return order;
  }

  async findOrdersByUserId(
    userId?: number,
    orderId?: number,
  ): Promise<OrderEntity[]> {
    const orders = await this.orderRepository.find({
      where: {
        userId,
        id: orderId,
      },
      relations: {
        address: {
          city: {
            state: true,
          }
        },
        ordersProduct: {
          product: true,
        },
        payment: {
          paymentStatus: true,
        },
        user: !!orderId,
      },
    });

    if (!orders || orders.length === 0) {
      throw new NotFoundException('Orders não encontrado');
    }

    return orders;
  }

  async findAllOrders(): Promise<OrderEntity[]> {
    const orders = await this.orderRepository.find({
      relations: {
        user: true,
      },
    });

    if (!orders || orders.length === 0) {
      throw new NotFoundException('Orders não encontrado');
    }

    const ordersProduct = await this.orderProductService.findAmountProductsByOrderId(
      orders.map((order) => order.id),
    );

    const ordersWithAmountProducts = orders.map((order) => {
      const orderProduct = ordersProduct.find((currentOrder) => currentOrder.order_id === order.id);

      if (orderProduct) {
        return {
          ...order,
          amountProducts: Number(orderProduct.total),
        };
      }
      return order;
    });

    // Gere o PDF a partir dos dados
    this.generatePDF(ordersWithAmountProducts);

    return ordersWithAmountProducts;
  }

  private generatePDF(orders: OrderEntity[]): void {
    const doc = new PDFDocument();
    const filePath = 'relatorio.pdf';

    // Crie o conteúdo do PDF com base nos dados da ordem
    orders.forEach((order) => {
      doc.text(`Order ID: ${order.id}`, 50, 50);
      doc.text(`User: ${order.user.name}`, 50, 70);
      doc.text(`Amount of Products: ${order.amountProducts}`, 50, 90);
      doc.text('------------------------', 50, 110);
    });

    // Salve o PDF em um arquivo
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);
    doc.end();
  }
}
