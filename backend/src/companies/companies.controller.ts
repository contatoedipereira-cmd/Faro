import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { SearchCompaniesDto } from './dto/search-companies.dto';
import { CreateCompanyDto } from './dto/create-company.dto';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get('search')
  search(@Query() query: SearchCompaniesDto) {
    return this.companiesService.search(query);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.companiesService.findById(id);
  }

  @Post()
  create(@Body() dto: CreateCompanyDto) {
    return this.companiesService.create(dto);
  }
}
