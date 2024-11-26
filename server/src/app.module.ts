import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RoulettesModule } from './roulettes/roulettes.module';
import { AccessCodesModule } from './access-codes/access-codes.module';
import { WinsModule } from './wins/wins.module';
import { LikesModule } from './likes/likes.module';
import { SocialLinksModule } from './social-links/social-links.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    RoulettesModule,
    AccessCodesModule,
    WinsModule,
    LikesModule,
    SocialLinksModule,
  ],
})
export class AppModule {}