import { Injectable } from '@nestjs/common';
import { Account } from './entities/account.entity';
import { Transaction } from './entities/transaction.entity';
import {
  CreateAccountDto,
  DepositDto,
  TransactionDto,
  TransferDto,
  WithdrawDto,
} from './dto/account.dto';

@Injectable()
export class AccountService {
  private accounts: Account[] = [];
  private IndexId = 1;
  private transactions: Transaction[] = [];

  public setAccounts(accounts: Account[]): void {
    this.accounts = accounts;
  }
  public getAccount(accountId: string) {
    return this.accounts.find((account) => account.id === accountId);
  }
  public setIndexId(id: number) {
    this.IndexId = id;
  }
  public getTransactions(index: number) {
    return this.transactions[index];
  }

  // 거래내역 기록
  addTransaction(accountId: string, type: string, amount: number, date: Date) {
    const newTransaction: Transaction = {
      accountId: accountId,
      type: type,
      amount: amount,
      date: date,
    };
    return newTransaction;
  }

  // 계좌 생성
  create(createAccountDto: CreateAccountDto): Account {
    const newAccount: Account = {
      id: (this.IndexId++).toString(),
      name: createAccountDto.accountName,
      balance: 0,
    };
    this.accounts.push(newAccount);
    return newAccount;
  }

  // 입금
  deposit(accountId: string, depositDto: DepositDto): Account {
    const account = this.accounts.find((account) => account.id === accountId);
    if (!account) {
      throw new Error('Account not found');
    }

    const newTransaction = this.addTransaction(
      accountId,
      '입금',
      depositDto.amount,
      new Date(),
    );
    this.transactions.push(newTransaction);
    account.balance += depositDto.amount;
    return account;
  }

  // 출금
  withdraw(accountId: string, withdrawDto: WithdrawDto): Account {
    const account = this.accounts.find((account) => account.id === accountId);
    if (!account) {
      throw new Error('Account not found');
    }
    if (account.balance < withdrawDto.amount) {
      throw new Error('Insufficient balance');
    }

    const newTransaction = this.addTransaction(
      accountId,
      '출금',
      withdrawDto.amount,
      new Date(),
    );
    this.transactions.push(newTransaction);
    account.balance -= withdrawDto.amount;
    return account;
  }

  // 송금
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

    const newTransaction = this.addTransaction(
      accountId,
      '송금',
      transferDto.amount,
      new Date(),
    );
    this.transactions.push(newTransaction);
    sendAccount.balance -= transferDto.amount;

    const newTransaction2 = this.addTransaction(
      transferDto.recipientAccountId,
      '입금',
      transferDto.amount,
      new Date(),
    );
    this.transactions.push(newTransaction2);
    receiveAccount.balance += transferDto.amount;
    return [sendAccount, receiveAccount];
  }

  // 거래내역조회
  transaction(accountId: string): TransactionDto[] {
    const idTransactions: TransactionDto[] = [];
    this.transactions
      .filter((transaction) => transaction.accountId === accountId)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .map((transaction) => {
        // Dto로 반환
        const newTransactionDto: TransactionDto = {
          type: transaction.type,
          amount: transaction.amount,
          transactionDate: transaction.date,
        };
        idTransactions.push(newTransactionDto);
      });
    return idTransactions;
  }
}
