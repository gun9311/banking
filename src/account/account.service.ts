import { Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Account } from './entities/account.entity';

@Injectable()
export class AccountService {
  private accounts: Account[] = [];
  private lastAccountId = 1;

  create(createAccountDto: CreateAccountDto): Account {
    const newAccount: Account = {
      id: this.lastAccountId++,
      name: createAccountDto.accountName,
      balance: 0,
    };
    this.accounts.push(newAccount);
    return newAccount;
  }

  findAll() {
    return `This action returns all account`;
  }

  findOne(id: number) {
    return `This action returns a #${id} account`;
  }

  update(id: number, updateAccountDto: UpdateAccountDto) {
    return `This action updates a #${id} account`;
  }

  remove(id: number) {
    return `This action removes a #${id} account`;
  }
}
