export type TUser = {
  id?: string;
  username: string;
  age: number;
  hobbies: string[];
};

export type TMessage = { workerId: string; cmd: string; userId: string; body: string };

export type TResult = [number, TUser | TUser[] | undefined];
export type TError = [number, string];
