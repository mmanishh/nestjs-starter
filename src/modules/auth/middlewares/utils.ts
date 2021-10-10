export function getPassportOptions() {
  return {
    session: false,
    scope: ['email', 'profile'],
    failureRedirect: this.configService.get('LOGIN_FAILED_REDIRECTION_URL'),
  };
}
