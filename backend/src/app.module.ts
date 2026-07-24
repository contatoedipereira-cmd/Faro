import 'dotenv/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { CompaniesModule } from './companies/companies.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), CompaniesModule],
})
export class AppModule {}
