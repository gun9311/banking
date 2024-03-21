import { Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Account } from './entities/account.entity';
import { DepositDto } from './dto/deposit.dto';

@Injectable()
export class AccountService {
  private accounts: Account[] = [];
  public setAccounts(accounts: Account[]): void {
    this.accounts = accounts;
  }
  private AccountId = 1;
  public setAccountId(id: number) {
    this.AccountId = id;
  }

  create(createAccountDto: CreateAccountDto): Account {
    const newAccount: Account = {
      id: this.AccountId++,
      name: createAccountDto.accountName,
      balance: 0,
    };
    this.accounts.push(newAccount);
    return newAccount;
  }

  deposit(accountId: number, depositDto: DepositDto): Account {
    const account = this.accounts.find((account) => account.id === accountId);
    if (!account) {
      throw new Error('Account not found');
    }
    account.balance += depositDto.amount;
    return account;
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
