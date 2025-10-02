import { IsEnum, IsOptional, IsString } from "class-validator";
import { OrderStatus, OrderStatusList } from "../enum/order.enum";

export class StatusDto {
    
    @IsOptional()
    @IsEnum(OrderStatusList, {
        message: `Valida status are: ${ OrderStatusList }`
    })
    status: OrderStatus
}