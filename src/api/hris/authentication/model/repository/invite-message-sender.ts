export type SendInvitePayload = {
  email: string;
  tempPassword: string;
};

export type InviteMessageSender = {
  sendInvite: (payload: SendInvitePayload) => Promise<void>;
};
