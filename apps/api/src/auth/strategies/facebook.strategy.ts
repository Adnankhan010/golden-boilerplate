import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-facebook';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
    constructor(private configService: ConfigService) {
        super({
            clientID: configService.get<string>('FACEBOOK_APP_ID') || 'placeholder_id',
            clientSecret: configService.get<string>('FACEBOOK_APP_SECRET') || 'placeholder_secret',
            callbackURL: configService.get<string>('API_URL')
                ? `${configService.get<string>('API_URL')}/auth/facebook/callback`
                : 'http://localhost:3000/auth/facebook/callback',
            scope: ['email'],
            profileFields: ['emails', 'name', 'photos'],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: (err: any, user: any, info?: any) => void,
    ): Promise<any> {
        const { name, emails, photos, id } = profile;
        const user = {
            email: emails[0].value,
            firstName: name.givenName,
            lastName: name.familyName,
            picture: photos[0].value,
            provider: 'FACEBOOK',
            providerId: id,
            accessToken,
        };
        done(null, user);
    }
}
