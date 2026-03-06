export type ChangePasswordRepository = {
  createChangePasswordRequest(email: string, token: string): Promise<void>;
  clearPendingChangePasswordRequests(email?: string): Promise<void>;
  changePassword: (email: string, password: string) => Promise<void>;
};
