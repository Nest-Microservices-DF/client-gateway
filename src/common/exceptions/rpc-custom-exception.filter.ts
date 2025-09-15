import { Catch, ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class RpcCustomExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const rpcError = exception.getError();

    if( typeof rpcError === 'object' && 
      rpcError !== null &&
      'status' in rpcError && 
      'message' in rpcError 
    ) {

      const { status } = rpcError as { status: number | string };
      const statusCode = isNaN(+status) ? 400 : +status;
      return response.status( statusCode ).json( rpcError);
      
    }

    response.status(400).json({
      statusCode: 400,
      message: rpcError || 'Bad Request'
    });

  }
}