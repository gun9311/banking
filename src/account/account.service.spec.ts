import { Test, TestingModule } from '@nestjs/testing';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { DepositDto } from './dto/deposit.dto';
import { Account } from './entities/account.entity';

describe('AccountService', () => {
  let service: AccountService;
  const accounts: Account[] = [
    { id: 1, name: 'Test Account 1', balance: 0 },
    { id: 2, name: 'Test Account 2', balance: 0 },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountService],
    }).compile();

    service = module.get<AccountService>(AccountService);
    service.setAccounts(accounts);
    service.setAccountId(3);
  });

  function testCreateAccount(
    createAccountDto: CreateAccountDto,
    expectedId: number,
    expectedName: string,
  ) {
    const createdAccount = service.create(createAccountDto);
    expect(createdAccount.id).toEqual(expectedId);
    expect(createdAccount.name).toEqual(expectedName);
    expect(createdAccount.balance).toEqual(0);
  }

  it('should create new accounts', () => {
    testCreateAccount({ accountName: 'Test Account1' }, 3, 'Test Account1');
    testCreateAccount({ accountName: 'Test Account 2' }, 4, 'Test Account 2');
  });

  function testDeposit(
    accountId: number,
    depositDto: DepositDto,
    expectedBalance: number,
  ) {
    const account = service.deposit(accountId, depositDto);
    expect(account.balance).toEqual(expectedBalance);
  }

  it('should increase accounts balance', () => {
    testDeposit(1, { amount: 30 }, 30);
    testDeposit(2, { amount: 50 }, 50);
    testDeposit(1, { amount: 40 }, 70);
  });
});
