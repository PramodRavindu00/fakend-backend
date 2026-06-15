import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class GithubStrategyService extends PassportStrategy(
  Strategy,
  'github',
) {}
