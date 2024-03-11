import * as express from 'express';

export interface ReqContext {
  appId: string;
  userId: string;
  teamId: string;
  workflowInstanceId: string;
}

export interface IRequest extends express.Request {
  context: ReqContext;
}
