import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateAddressDto } from './dtos/createAddress.dto';
import { AddressService } from './address.service';
import { AddressEntity } from './entities/address.entity';
import { Roles } from '../decorators/roles.decorator';
import { UserType } from '../user/enum/user-type.enum';
import { UserId } from '../decorators/user-id.decorator';

@Roles(UserType.User)
@Controller('address')
export class AddressController {
    constructor(
        private readonly addressService: AddressService,
    ) {}

    @Post()
    @UsePipes(ValidationPipe)
    async createAdress(@Body() createAddressDto: CreateAddressDto, @UserId('userId') userId: number): Promise<AddressEntity> {
        return this.addressService.createAddress(createAddressDto, userId);
    }
}
