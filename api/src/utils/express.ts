import * as express from 'express';

export type RequestHandler = (
  req: express.Request
) => Promise<Object | Array<any>>;

export const toExpress = (requestHandler: RequestHandler) => async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<void> => {
  try {
    res.send(await requestHandler(req));
  } catch (err) {
    next(err);
  }
};
