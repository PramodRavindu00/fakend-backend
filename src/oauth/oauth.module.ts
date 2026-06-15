import { Module } from '@nestjs/common';
import { OauthService } from './oauth.service';
import { OauthController } from './oauth.controller';
import { GoogleStrategyService } from './strategy/google-strategy/google-strategy.service';
import { GithubStrategyService } from './strategy/github-strategy/github-strategy.service';
import { PassportModule } from '@nestjs/passport';
@Module({
  imports: [PassportModule],
  providers: [OauthService, GoogleStrategyService, GithubStrategyService],
  controllers: [OauthController],
})
export class OauthModule {}
