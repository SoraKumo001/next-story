import { initialSession } from "@components/next-session";
import { Request, Response } from "express";
export default (req: Request, res: Response) => {
  initialSession({ req, res }).then(() => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    if (req.body.graphqlToken && req.session)
      req.session.graphqlToken = req.body.graphqlToken;
    res.end('{result:"OK"}');
  });
};
