import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AxiosError } from 'axios';
import { Observable } from 'rxjs';
import { ReturnCepExternalDTO } from './dtos/return-cep-external.dto';
import { CityService } from 'src/city/city.service';

@Injectable()
export class CorreiosService {
  URL_CORREIOS = process.env.URL_CEP_CORREIOS;
  constructor(
    private readonly httpService: HttpService,
    private readonly cityService: CityService,
  ) {}

  async findAddressByCep(cep: string): Promise<ReturnCepExternalDTO> {
    const returnCep: ReturnCepExternalDTO = await this.httpService.axiosRef
      .get<ReturnCepExternalDTO>(this.URL_CORREIOS.replace('{CEP}', cep))
      .then((result) => {
        if (result.data.erro === 'true') {
          throw new NotFoundException('CEP não encontrado');
        }
        return result.data;
      })
      .catch((error: AxiosError) => {
        throw new BadRequestException(
          `Error in connection request ${error.message}`,
        );
      });

    const city = await this.cityService.findCityByName(
      returnCep.localidade,
      returnCep.uf,
    );

    return returnCep;
  }
}
