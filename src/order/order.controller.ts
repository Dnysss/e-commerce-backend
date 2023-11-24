import { Body, Controller, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateOrderDTO } from './dtos/create-order.dto';
import { OrderService } from './order.service';
import { UserId } from 'src/decorators/user-id.decorator';

@Controller('order')
export class OrderController {
    constructor(
        private readonly orderService: OrderService
    ) {}
    @Post()
    @UsePipes(ValidationPipe)

    async createOrder(
        @Body() createOrderDTO: CreateOrderDTO,
        @UserId() userId: number,
    ) {
        return this.orderService.createOrder(createOrderDTO, userId)
    }
}
