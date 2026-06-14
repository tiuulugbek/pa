import { Body, Controller, Post } from '@nestjs/common';
import { InquiryService } from './inquiry.service';
import { CreateContactDto, CreateInquiryDto } from './dto';

@Controller()
export class InquiryController {
  constructor(private readonly service: InquiryService) {}

  @Post('inquiry')
  inquiry(@Body() dto: CreateInquiryDto) {
    return this.service.createInquiry(dto);
  }

  @Post('contact')
  contact(@Body() dto: CreateContactDto) {
    return this.service.createContact(dto);
  }
}
