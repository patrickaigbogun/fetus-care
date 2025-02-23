export type Message = {
  id: string;
  sentBy: string;
  senderAccountType: "patient" | "professional";
  createdAt: string;
  deleted: boolean;
  deletedAt: null;
  text: string;
  pdf: null;
  image: null;
  audio: null;
  video: null;
  file: null;
};

export type Professional = {
  id: string;
  name: string;
  avatar: string;
  field: string;
  phoneNumber: string;
  email: string;
};

export type Chat = {
  id: string;
  createdAt: string;
  creatorId: string;
  professional: Professional;
  content: {
    lastMessage: Message;
    messages: Message[];
  } | null;
};
