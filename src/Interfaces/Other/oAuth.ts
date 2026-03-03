export interface GoogleTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
  token_type: 'Bearer';
  id_token?: string;
}

export interface GoogleUserInfoResponse {
  sub: string;
  name: string;
  email: string;
  phone: string;
  picture: string;
  email_verified: boolean;
}
