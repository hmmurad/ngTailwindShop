export class User {
  constructor(
    public email: string,
    public userId: string,
    private _token: string,
    private _expirationDuration: Date
  ) {}

  get token() {
    if (!this._expirationDuration || new Date() > this._expirationDuration) {
      return null;
    }
    return this._token;
  }
}
