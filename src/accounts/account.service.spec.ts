import { Test, TestingModule } from '@nestjs/testing';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { DepositDto } from './dto/deposit.dto';
import { Account } from './entities/account.entity';
import { TransferDto } from './dto/transfer.dto';
import { TransactionDto } from './dto/transaction.dto';

describe('AccountService', () => {
  let service: AccountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountService],
    }).compile();

    // 모든 테스트에 대해 2개의 테스트 계좌 초기 세팅
    const accounts: Account[] = [
      { id: '1', name: 'Test Account 1', balance: 50000 },
      { id: '2', name: 'Test Account 2', balance: 100000 },
    ];
    service = module.get<AccountService>(AccountService);
    service.setAccounts(accounts);
    service.setIndexId(3); // 2개 세팅이므로 id는 3부터 부여
  });

  // 계좌 생성 테스트 헬퍼 함수
  function testCreateAccount(
    createAccountDto: CreateAccountDto,
    expectedId: string,
    expectedName: string,
  ) {
    const createdAccount = service.create(createAccountDto);
    expect(createdAccount.id).toEqual(expectedId); // id 확인
    expect(createdAccount.name).toEqual(expectedName); // 이름 확인
    expect(createdAccount.balance).toEqual(0); // 잔액 확인
  }

  // 계좌 생성 테스트
  it('should create new accounts', () => {
    testCreateAccount({ accountName: 'Test Account3' }, '3', 'Test Account3'); // 2개 초기 세팅이므로 Id는 3
    testCreateAccount({ accountName: 'Test Account4' }, '4', 'Test Account4'); // Id는 4
  });

  // 입금 테스트 헬퍼 함수
  function testDeposit(
    accountId: string,
    depositDto: DepositDto,
    expectedBalance: number | string,
  ) {
    // 입금만큼 잔액 증가 확인
    if (typeof expectedBalance === 'number') {
      const account = service.deposit(accountId, depositDto);
      expect(account.balance).toEqual(expectedBalance);
    } else {
      // 없는 계좌면 오류 반환
      expect(() => service.deposit(accountId, depositDto)).toThrow(
        expectedBalance,
      );
    }
  }

  // 입금 테스트
  it('should increase accounts balance', () => {
    testDeposit('1', { amount: 300 }, 50300);
    testDeposit('2', { amount: 40000 }, 140000);
    testDeposit('1', { amount: 12345 }, 62645);
    testDeposit('5', { amount: 40 }, 'Account not found');
  });

  // 출금 테스트 헬퍼 함수
  function testWithdraw(
    accountId: string,
    depositDto: DepositDto,
    expectedBalance: number | string,
  ) {
    // 출금만큼 잔액 감소 확인
    if (typeof expectedBalance === 'number') {
      const account = service.withdraw(accountId, depositDto);
      expect(account.balance).toEqual(expectedBalance);
    } else {
      // 없는 계좌 또는 잔액이 모자라면 오류 반환
      expect(() => service.withdraw(accountId, depositDto)).toThrow(
        expectedBalance,
      );
    }
  }

  // 출금 테스트
  it('should decrease accounts balance', () => {
    testWithdraw('1', { amount: 25000 }, 25000);
    testWithdraw('2', { amount: 1 }, 99999);
    testWithdraw('1', { amount: 5000 }, 20000);
    testWithdraw('3', { amount: 90 }, 'Account not found');
    testWithdraw('1', { amount: 100000 }, 'Insufficient balance');
    testWithdraw('2', { amount: 99999 }, 0);
  });

  // 송금 테스트 헬퍼 함수
  function testTransfer(
    sender: string,
    transferDto: TransferDto,
    expectedSenderBalance: number | string,
    expectedReceiverBalance: number,
  ) {
    // 출금 계좌의 잔액 감소, 입금 계좌의 잔액 증가 확인
    if (typeof expectedSenderBalance === 'number') {
      const accounts = service.transfer(sender, transferDto);
      const sendAccount = accounts[0];
      const receiveAccount = accounts[1];
      expect(sendAccount.balance).toEqual(expectedSenderBalance);
      expect(receiveAccount.balance).toEqual(expectedReceiverBalance);
    } else {
      // 없는 계좌 또는 출금 계좌의 잔액이 모자라면 오류 반환
      expect(() => service.transfer(sender, transferDto)).toThrow(
        expectedSenderBalance,
      );
    }
  }
  // 송금 테스트
  it('should transfer account', () => {
    testTransfer(
      '1',
      { recipientAccountId: '2', amount: 10000 },
      40000,
      110000,
    ); // 정상처리

    testTransfer(
      '2',
      { recipientAccountId: '1', amount: 10000 },
      100000,
      50000,
    ); // 정상처리

    testTransfer(
      '1',
      { recipientAccountId: '5', amount: 10000 },
      'Account not found',
      0,
    ); // 존재하지 않는 입금 계좌 오류처리

    testTransfer(
      '3',
      { recipientAccountId: '1', amount: 10000 },
      'Account not found',
      0,
    ); // 존재하지 않는 출금 계좌 오류처리

    testTransfer(
      '2',
      { recipientAccountId: '1', amount: 110000 },
      'Insufficient balance',
      0,
    ); // 출금 계좌의 잔액 부족 오류처리
  });

  // 거래내역 테스트 헬퍼 함수
  function testTransaction(
    accountId: string,
    expectedTransaction: TransactionDto[],
  ) {
    // 거래내역에 거래 일시 기준 오름차순으로 증감, 금액, 거래 일시 표시 확인
    const transactions = service.transaction(accountId);
    expect(transactions).toEqual(expectedTransaction);
  }

  it('should show all transactions', () => {
    // 거래 기록 남기기
    service.deposit('1', { amount: 2000 });
    const date1 = service.getTransactions()[0].date;
    service.transfer('1', { recipientAccountId: '2', amount: 2000 });
    const date2 = service.getTransactions()[1].date;
    const date3 = service.getTransactions()[2].date;
    service.withdraw('1', { amount: 3000 });
    const date4 = service.getTransactions()[3].date;
    service.transfer('2', { recipientAccountId: '1', amount: 5000 });
    const date5 = service.getTransactions()[4].date;
    const date6 = service.getTransactions()[5].date;
    service.withdraw('2', { amount: 1000 });
    const date7 = service.getTransactions()[6].date;

    // 거래내역 테스트1, 내용 및 오름차순 정렬 확인
    testTransaction('1', [
      { type: '입금', amount: 2000, transactionDate: date1 },
      { type: '송금', amount: 2000, transactionDate: date2 },
      { type: '출금', amount: 3000, transactionDate: date4 },
      { type: '입금', amount: 5000, transactionDate: date6 },
    ]);

    // 거래내역 테스트2, 내용 및 오름차순 정렬 확인
    testTransaction('2', [
      { type: '입금', amount: 2000, transactionDate: date3 },
      { type: '송금', amount: 5000, transactionDate: date5 },
      { type: '출금', amount: 1000, transactionDate: date7 },
    ]);
  });

  // 동시처리 테스트
  it('should transact simultaneous request', async () => {
    // 입출송금 동시처리 확인 1
    const testAccounts1 = await Promise.all([
      service.deposit('1', { amount: 20000 }),
      service.withdraw('1', { amount: 10000 }),
      service.transfer('1', { recipientAccountId: '2', amount: 10000 }),
    ]);
    const account1 = testAccounts1[2][0];
    expect(account1.balance).toEqual(50000);

    // 입출송금 동시처리 확인 2
    const testAccounts2 = await Promise.all([
      service.deposit('2', { amount: 20000 }),
      service.withdraw('2', { amount: 10000 }),
      service.transfer('2', { recipientAccountId: '1', amount: 10000 }),
    ]);
    const account2 = testAccounts2[2][0];
    expect(account2.balance).toEqual(110000);

    // 동시 전액 출금 및 오류처리 확인 1
    expect(() =>
      Promise.all([
        service.withdraw('1', { amount: 50000 }),
        service.withdraw('1', { amount: 50000 }),
      ]),
    ).toThrow('Insufficient balance');

    // 동시 전액 출금 및 오류처리 확인 2
    expect(() =>
      Promise.all([
        service.withdraw('2', { amount: 110000 }),
        service.transfer('2', { recipientAccountId: '1', amount: 110000 }),
      ]),
    ).toThrow('Insufficient balance');
  });
});
