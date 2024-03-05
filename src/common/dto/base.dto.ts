export interface WorkflowContext {
  userId: string;
  teamId: string;
  userToken: string;
  APP_ID: string;
  APP_URL: string;

  workflowInstanceId: string;
  taskId: string;
}

export class BaseReqDto {
  __context: WorkflowContext;
}
