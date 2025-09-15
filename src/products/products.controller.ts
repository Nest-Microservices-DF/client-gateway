import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { PaginationDto } from 'src/common';
import { CreateProductDto, UpdateProductDto } from 'src/products/dto/';
import { PRODUCT_SERVICE } from 'src/config';

@Controller('products')
export class ProductsController {

  constructor(
    @Inject( PRODUCT_SERVICE ) private readonly productsClient: ClientProxy,
  ) {}

  @Post()
  createProduct( @Body() createProductDto: CreateProductDto ) {
    return this.productsClient.send({ cmd: 'create_product' }, createProductDto);
  }

  @Get()
  findAllProducts( @Query() paginationDto: PaginationDto ) {
    return this.productsClient.send({ cmd: 'find_all' }, paginationDto);
  }

  @Get(':id')
  async findOne( @Param('id', ParseIntPipe) id: number ) {

    try {
      
      const product = await firstValueFrom( 
        this.productsClient.send({ cmd: 'find_one' }, { id }) 
      );
      return product;

    } catch (error) {

      throw new RpcException( error );
      
    }
    
  }

  @Patch(':id')
  updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto
  ) {
    return this.productsClient.send({ cmd: 'update_product' }, 
      {
        id, 
        ...updateProductDto
      }).pipe( 
        catchError( err => {
          throw new RpcException( err );
        })
      );
  }

  @Delete(':id')
  deleteProduct(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.productsClient.send({ cmd: 'delete_product' }, { id })
      .pipe( 
        catchError( err => {
          throw new RpcException( err );
        })
      );
  }


}
