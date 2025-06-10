import { User } from '../modules/users/users.interfaces'

import * as express from 'express';

declare global {
  namespace Express {
    interface Request {
      user: User
    }
  }
}