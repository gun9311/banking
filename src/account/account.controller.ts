import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { DepositDto } from './dto/deposit.dto';
import { WithdrawDto } from './dto/withdraw.dto';
import { TransferDto } from './dto/transfer.dto';

@Controller('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  async create(@Body() createAccountDto: CreateAccountDto) {
    return this.accountService.create(createAccountDto);
  }

  @Post(':accountId/deposit')
  deposit(@Param('accountId') accountId: string, @Body() depositDto: DepositDto) {
    return this.accountService.deposit(accountId, depositDto.amount)
  }

  @Post(':accountId/withdraw')
  withdraw(@Param('accountId') accountId: string, @Body() withdrawDto: WithdrawDto) {}

  @Post()
  transfer(@Body() transferDto: TransferDto) {}

  @Get(@Param )
  

  @Get()
  findAll() {
    return this.accountService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.accountService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAccountDto: UpdateAccountDto) {
    return this.accountService.update(+id, updateAccountDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.accountService.remove(+id);
  }
}
