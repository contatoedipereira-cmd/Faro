import { Controller, Get, Param, Query } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { SearchCompaniesDto } from './dto/search-companies.dto';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get('search')
  search(@Query() filters: SearchCompaniesDto) {
    return this.companiesService.search(filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companiesService.findOne(id);
  }
}
