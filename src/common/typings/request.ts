import * as express from 'express';

export interface IRequest extends express.Request {
  monkeyAppId: string;
  monkeyUserId: string;
  monkeyTeamId: string;
  monkeyWorkflowInstanceId: string;
}
