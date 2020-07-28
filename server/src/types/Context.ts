import { Request, Response } from "express";
import { Redis } from "ioredis";
import { User } from "../entity/User";

export interface MyContext {
  req: Request;
  res: Response;
  redis: Redis;
  url: string;
  user: User | undefined;
  sessionIDs: string[];
}
