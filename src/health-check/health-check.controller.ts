import { Controller, Get } from '@nestjs/common';

@Controller('health-check')
export class HealthCheckController {

    @Get()
    healthCheck() {
        return 'Cliente Gateway is up and running!';
    }

}
