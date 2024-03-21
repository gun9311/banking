import { Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { Account } from './entities/account.entity';
import { DepositDto } from './dto/deposit.dto';
import { WithdrawDto } from './dto/withdraw.dto';
import { TransferDto } from './dto/transfer.dto';

@Injectable()
export class AccountService {
  private accounts: Account[] = [];
  public setAccounts(accounts: Account[]): void {
    this.accounts = accounts;
  }
  private IndexId = 1;
  public setIndexId(id: number) {
    this.IndexId = id;
  }

  create(createAccountDto: CreateAccountDto): Account {
    const newAccount: Account = {
      id: (this.IndexId++).toString(),
      name: createAccountDto.accountName,
      balance: 0,
    };
    this.accounts.push(newAccount);
    return newAccount;
  }

  deposit(accountId: string, depositDto: DepositDto): Account {
    const account = this.accounts.find((account) => account.id === accountId);
    if (!account) {
      throw new Error('Account not found');
    }
    account.balance += depositDto.amount;
    return account;
  }

  withdraw(accountId: string, withdrawDto: WithdrawDto): Account {
    const account = this.accounts.find((account) => account.id === accountId);
    if (!account) {
      throw new Error('Account not found');
    }
    if (account.balance < withdrawDto.amount) {
      throw new Error('Insufficient balance');
    }
    account.balance -= withdrawDto.amount;
    return account;
  }

  transfer(accountId: string, transferDto: TransferDto): Account[] {
    const sendAccount = this.accounts.find(
      (account) => account.id === accountId,
    );
    const receiveAccount = this.accounts.find(
      (account) => account.id === transferDto.recipientAccountId,
    );
    if (!sendAccount || !receiveAccount) {
      throw new Error('Account not found');
    }
    if (sendAccount.balance < transferDto.amount) {
      throw new Error('Insufficient balance');
    }
    sendAccount.balance -= transferDto.amount;
    receiveAccount.balance += transferDto.amount;

    return [sendAccount, receiveAccount];
  }
}
