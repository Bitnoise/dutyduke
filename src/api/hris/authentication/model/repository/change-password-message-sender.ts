export type ChangePasswordPayload = {
  email: string;
  token: string;
};

export type ChangePasswordMessageSender = {
  sendChangePasswordRequestToken: (payload: ChangePasswordPayload) => Promise<void>;
};
