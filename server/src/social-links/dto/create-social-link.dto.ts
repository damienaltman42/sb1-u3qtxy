import { IsString, IsUrl } from 'class-validator';

export class CreateSocialLinkDto {
  @IsString()
  platform: string;

  @IsUrl()
  url: string;
}