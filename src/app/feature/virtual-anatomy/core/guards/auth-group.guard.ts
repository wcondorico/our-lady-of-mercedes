import { CanActivateFn } from '@angular/router';
import { TokensService } from '../stores/tokens.service';
import { inject } from '@angular/core';

export const authGroupGuard: CanActivateFn = (route, state) => {
  const tokenService: TokensService = inject(TokensService);
  return tokenService.accessToken || tokenService.refreshToken? true:false;
};
