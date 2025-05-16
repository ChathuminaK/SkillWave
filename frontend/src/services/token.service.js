// frontend/src/services/token.service.js
import { TokenUtil } from './token.util';

const TokenService = {
  getToken: () => TokenUtil.getToken(),
  getRefreshToken: () => TokenUtil.getRefreshToken(),
  saveToken: (token) => TokenUtil.saveToken(token),
  saveRefreshToken: (refreshToken) => TokenUtil.saveRefreshToken(refreshToken),
  removeTokens: () => TokenUtil.removeTokens(),
  isTokenExpiring: (minValidity = 300) => TokenUtil.isTokenExpiring(minValidity)
};

export default TokenService;