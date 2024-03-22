import { Module } from '@nestjs/common';
import { AccountModule } from './accounts/account.module';

@Module({
  imports: [AccountModule],
})
export class AppModule {}
