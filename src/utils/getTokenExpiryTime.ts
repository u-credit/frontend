export const getTokenExpiryTime = (accessToken: string): number => {
  const payload = JSON.parse(atob(accessToken.split('.')[1]));
  return payload.exp * 1000;
};