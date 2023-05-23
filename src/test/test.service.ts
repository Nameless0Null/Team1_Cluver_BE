import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Club } from 'src/entity/club.entity';
import { Repository } from 'typeorm';
const ExcelJS = require('exceljs');

@Injectable()
export class TestService {
  constructor(
    @InjectRepository(Club)
    private clubRepository: Repository<Club>,
  ) {}

  async 엑셀만드는함수() {
    const filename = '1';

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet();

    const rawData = [
      { header: 'order_id', data: ['12345678', '12345679', '12345680'] },
      { header: 'store_id', data: ['storeA', 'storeB', 'storeC'] },
      { header: 'country_id', data: ['KR', 'KR', 'KR'] },
      { header: 'price', data: ['15000', '10000', '20000'] },
    ];

    rawData.forEach((data, index) => {
      worksheet.getColumn(index + 1).values = [data.header, ...data.data];
    });

    await workbook.xlsx.writeFile(`./src/test/${filename}.xlsx`);
  }
}
