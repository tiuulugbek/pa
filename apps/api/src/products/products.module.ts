import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { DatasheetService } from '../datasheet/datasheet.service';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, DatasheetService],
  exports: [ProductsService],
})
export class ProductsModule {}
