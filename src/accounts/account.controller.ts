import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { AccountService } from './account.service';
import {
  CreateAccountDto,
  DepositDto,
  TransferDto,
  WithdrawDto,
} from './dto/account.dto';

@Controller('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  // 계좌 생성
  @Post()
  create(@Body() createAccountDto: CreateAccountDto) {
    return this.accountService.create(createAccountDto);
  }

  // 입금
  @Post(':accountId/deposit')
  deposit(
    @Param('accountId') accountId: string,
    @Body() depositDto: DepositDto,
  ) {
    return this.accountService.deposit(accountId, depositDto);
  }

  // 출금
  @Post(':accountId/withdraw')
  withdraw(
    @Param('accountId') accountId: string,
    @Body() withdrawDto: WithdrawDto,
  ) {
    return this.accountService.withdraw(accountId, withdrawDto);
  }

  // 송금
  @Post(':accountId/transfer')
  transfer(
    @Param('accountId') accountId: string,
    @Body() transferDto: TransferDto,
  ) {
    return this.accountService.transfer(accountId, transferDto);
  }

  // 계좌 내역 조회
  @Get(':accountId')
  transaction(@Param('accountId') accountId: string) {
    return this.accountService.transaction(accountId);
  }
}
