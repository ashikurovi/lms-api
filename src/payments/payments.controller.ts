import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpStatus,
  UseGuards,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { UserRole } from '../users/entities/user.entity';
import { ConfigService } from '@nestjs/config';

@Controller('payments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Initiate a payment — authenticated endpoint.
   * Creates a PENDING payment and returns SSLCOMMERZ redirect URL.
   */
  @Post('initiate')
  async initiatePayment(@Body() createPaymentDto: CreatePaymentDto) {
    const data = await this.paymentsService.initiatePayment(createPaymentDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Payment initiated successfully',
      data,
    };
  }

  /**
   * SSLCOMMERZ IPN callback — public, no auth required.
   * This is the ONLY place where payment status is verified and updated.
   */
  @Public()
  @Post('ipn')
  async handleIPN(@Body() ipnData: any) {
    const data = await this.paymentsService.handleIPN(ipnData);
    return data;
  }

  /**
   * SSLCOMMERZ success redirect — public.
   * Does NOT mark payment as success. Only for frontend redirect.
   */
  @Public()
  @Post('success')
  async handleSuccess(@Body() body: any, @Res() res: Response) {
    const result = await this.paymentsService.handleSuccess(body);
    const successUrl =
      this.configService.get<string>('SSLCOMMERZ_SUCCESS_URL') ||
      'http://localhost:3000/payment/success';
    return res.redirect(
      `${successUrl}?tran_id=${result.transaction_id}&status=${result.status}`,
    );
  }

  /**
   * SSLCOMMERZ fail redirect — public.
   */
  @Public()
  @Post('fail')
  async handleFail(@Body() body: any, @Res() res: Response) {
    const result = await this.paymentsService.handleFail(body);
    const failUrl =
      this.configService.get<string>('SSLCOMMERZ_FAIL_URL') ||
      'http://localhost:3000/payment/fail';
    return res.redirect(
      `${failUrl}?tran_id=${result.transaction_id}`,
    );
  }

  /**
   * SSLCOMMERZ cancel redirect — public.
   */
  @Public()
  @Post('cancel')
  async handleCancel(@Body() body: any, @Res() res: Response) {
    const result = await this.paymentsService.handleCancel(body);
    const cancelUrl =
      this.configService.get<string>('SSLCOMMERZ_CANCEL_URL') ||
      'http://localhost:3000/payment/cancel';
    return res.redirect(
      `${cancelUrl}?tran_id=${result.transaction_id}`,
    );
  }

  /**
   * List all payments — admin only.
   */
  @Get()
  @Roles(UserRole.ADMIN, UserRole.MODERATOR, UserRole.DEVELOPER)
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('enrollment_id') enrollmentId?: string,
    @Query('installment_id') installmentId?: string,
    @Query('status') status?: string,
  ) {
    const data = await this.paymentsService.findAll(
      page,
      limit,
      enrollmentId,
      installmentId,
      status,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'Payments retrieved successfully',
      data,
    };
  }

  /**
   * Get single payment details.
   */
  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.MODERATOR, UserRole.DEVELOPER)
  async findOne(@Param('id') id: string) {
    const data = await this.paymentsService.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Payment retrieved successfully',
      data,
    };
  }
}
