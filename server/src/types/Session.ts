export interface Session {
  userId: string;
  destroy: () => void;
}
