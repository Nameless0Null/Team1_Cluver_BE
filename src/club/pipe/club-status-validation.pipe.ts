import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import { ClubStatus } from '../club-status.enum';

export class ClubStatusValidationPipe implements PipeTransform {
  readonly StatusOptions = [
    ClubStatus.PRIVATE, //
    ClubStatus.PUBLIC,
  ];

  transform(value: any, metadata: ArgumentMetadata) {
    value = value.toUpperCase();

    console.log('value : ', value);

    if (!this.isStatusValid(value)) {
      throw new BadRequestException(`${value}는 statusOption 안에 없음.`);
    }

    return value;
  }

  private isStatusValid(status: any) {
    // indexOf
    // 배열안에 값이 있으면 그 값의 인덱스, 없으면 -1 반환
    const index = this.StatusOptions.indexOf(status);
    return index !== -1;
  }
}
