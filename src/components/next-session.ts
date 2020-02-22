import expressSession from "express-session";
import { Request, Response } from "express";
import { NextPageContext } from "next";
const session = expressSession({
  secret: "nextjs"
});

export const initialSession = (
  ctx: NextPageContext | { res: unknown; req: unknown }
) =>
  new Promise<{ [key: string]: string } | undefined>(resolve => {
    const { req, res } = ctx as typeof ctx & {
      req: Request & { session?: { [key: string]: string } };
      res: Response;
    };
    if (!req) return resolve(undefined);
    session(req, res, () => resolve(req.session));
  });
