import { Controller, Get, Post, Body, Param, Inject, Query, ParseIntPipe, ParseUUIDPipe, Patch } from '@nestjs/common';
import { CreateOrderDto, OrderPaginationDto, StatusDto } from './dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICE, ORDER_SERVICE } from 'src/config';
import { PaginationDto } from 'src/common';
import { firstValueFrom } from 'rxjs';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject( NATS_SERVICE ) private readonly ordersClient: ClientProxy,
  ) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersClient.send('createOrder', createOrderDto);
  }

  @Get()
  async findAll(@Query() orderPaginationDto: OrderPaginationDto) {
    try {
      
      const orders = await firstValueFrom (
        this.ordersClient.send('findAllOrders', orderPaginationDto) 
      );
      return orders;

    } catch (error) {
      throw new RpcException( error );
    }
  }

  @Get('id/:id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    
    try {
          
      const order = await firstValueFrom( 
        this.ordersClient.send('findOneOrder', { id }) 
      );
      return order;

    } catch (error) {
      throw new RpcException( error );
    }

  }

  @Get(':status')
  async findAllByStatus(
    @Param() statusDto: StatusDto,
    @Query() paginationDto: PaginationDto
  ) {
    
    try {
          
      const order = await firstValueFrom( 
        this.ordersClient.send('findAllOrders', { 
          ...paginationDto, 
          status: statusDto.status 
        }) 
      );
      return order;

    } catch (error) {
      throw new RpcException( error );
    }

  }

  @Patch(':id')
  async changeStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() statusDto: StatusDto,
  ) {

    try {
      return this.ordersClient.send('changeOrderStatus', {id, status: statusDto.status});
    } catch (error) {
      throw new RpcException(error);
    }
    
  }

}
