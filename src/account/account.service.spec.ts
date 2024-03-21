import { Test, TestingModule } from '@nestjs/testing';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';

describe('AccountService', () => {
  let service: AccountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountService],
    }).compile();

    service = module.get<AccountService>(AccountService);
  });

  it('should create a new account', () => {
    const createAccountDto1: CreateAccountDto = {
      accountName: 'Test Account1',
    };
    const createAccountDto2: CreateAccountDto = {
      accountName: 'Test Account 2',
    };

    const createdAccount1 = service.create(createAccountDto1);
    expect(service['accounts']).toContain(createdAccount1);
    expect(createdAccount1.id).toEqual(1);
    expect(createdAccount1.name).toEqual(createAccountDto1.accountName);
    expect(createdAccount1.balance).toEqual(0);

    const createdAccount2 = service.create(createAccountDto2);
    expect(service['accounts']).toContain(createdAccount2);
    expect(createdAccount2.id).toEqual(2);
    expect(createdAccount2.name).toEqual(createAccountDto2.accountName);
    expect(createdAccount2.balance).toEqual(0);
  });
});
