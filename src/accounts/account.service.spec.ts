import { Test, TestingModule } from '@nestjs/testing';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { DepositDto } from './dto/deposit.dto';
import { Account } from './entities/account.entity';
import { TransferDto } from './dto/transfer.dto';

describe('AccountService', () => {
  let service: AccountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountService],
    }).compile();

    const accounts: Account[] = [
      { id: '1', name: 'Test Account 1', balance: 50000 },
      { id: '2', name: 'Test Account 2', balance: 100000 },
    ];
    service = module.get<AccountService>(AccountService);
    service.setAccounts(accounts);
    service.setIndexId(3);
  });

  function testCreateAccount(
    createAccountDto: CreateAccountDto,
    expectedId: string,
    expectedName: string,
  ) {
    const createdAccount = service.create(createAccountDto);
    expect(createdAccount.id).toEqual(expectedId);
    expect(createdAccount.name).toEqual(expectedName);
    expect(createdAccount.balance).toEqual(0);
  }

  it('should create new accounts', () => {
    testCreateAccount({ accountName: 'Test Account3' }, '3', 'Test Account3');
    testCreateAccount({ accountName: 'Test Account4' }, '4', 'Test Account4');
  });

  function testDeposit(
    accountId: string,
    depositDto: DepositDto,
    expectedBalance: number | string,
  ) {
    if (typeof expectedBalance === 'number') {
      const account = service.deposit(accountId, depositDto);
      expect(account.balance).toEqual(expectedBalance);
    } else {
      expect(() => service.deposit(accountId, depositDto)).toThrow(
        expectedBalance,
      );
    }
  }

  it('should increase accounts balance', () => {
    testDeposit('1', { amount: 300 }, 50300);
    testDeposit('2', { amount: 40000 }, 140000);
    testDeposit('1', { amount: 12345 }, 62645);
    testDeposit('5', { amount: 40 }, 'Account not found');
  });

  function testWithdraw(
    accountId: string,
    depositDto: DepositDto,
    expectedBalance: number | string,
  ) {
    if (typeof expectedBalance === 'number') {
      const account = service.withdraw(accountId, depositDto);
      expect(account.balance).toEqual(expectedBalance);
    } else {
      expect(() => service.withdraw(accountId, depositDto)).toThrow(
        expectedBalance,
      );
    }
  }

  it('should decrease accounts balance', () => {
    testWithdraw('1', { amount: 25000 }, 25000);
    testWithdraw('2', { amount: 1 }, 99999);
    testWithdraw('1', { amount: 5000 }, 20000);
    testWithdraw('3', { amount: 90 }, 'Account not found');
    testWithdraw('1', { amount: 100000 }, 'Insufficient balance');
    testWithdraw('2', { amount: 99999 }, 0);
  });

  function testTransfer(
    sender: string,
    transferDto: TransferDto,
    expectedSenderBalance: number | string,
    expectedReceiverBalance: number,
  ) {
    if (typeof expectedSenderBalance === 'number') {
      const accounts = service.transfer(sender, transferDto);
      const sendAccount = accounts[0];
      const receiveAccount = accounts[1];
      expect(sendAccount.balance).toEqual(expectedSenderBalance);
      expect(receiveAccount.balance).toEqual(expectedReceiverBalance);
    } else {
      expect(() => service.transfer(sender, transferDto)).toThrow(
        expectedSenderBalance,
      );
    }
  }

  it('should transfer account', () => {
    testTransfer(
      '1',
      { recipientAccountId: '2', amount: 10000 },
      40000,
      110000,
    );
    testTransfer(
      '2',
      { recipientAccountId: '1', amount: 10000 },
      100000,
      50000,
    );
    testTransfer(
      '1',
      { recipientAccountId: '5', amount: 10000 },
      'Account not found',
      0,
    );
    testTransfer(
      '3',
      { recipientAccountId: '1', amount: 10000 },
      'Account not found',
      0,
    );
    testTransfer(
      '2',
      { recipientAccountId: '1', amount: 110000 },
      'Insufficient balance',
      0,
    );
  });
});
