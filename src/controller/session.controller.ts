import { Request, Response } from "express";
import {
  createSession,
  findSessions,
  updateSessions,
} from "../service/session.service";
import { validatePassword } from "../service/user.service";
import config from "config";
import { signJwt } from "../utils/jwt.utils";

export async function createUserSessionHandler(req: Request, res: Response) {
  const user = await validatePassword(req.body);

  if (!user) return res.status(401).send("Invalid email or password");

  // create session
  const session = await createSession(user._id, req.get("user-agent") || "");

  // create access token
  const accessToken = signJwt(
    // @ts-ignore
    { ...user, session: session._id },
    { expiresIn: config.get("accessTokenTtl") } // 15 min
  );

  // create refresh token
  const refreshToken = signJwt(
    // @ts-ignore
    { ...user, session: session._id },
    { expiresIn: config.get("refreshTokenTtl") } // 1 year
  );

  // return access and refresh tokens
  return res.send({ accessToken, refreshToken });
}

export async function getUserSessionHandler(req: Request, res: Response) {
  const userId = res.locals.user._id;
  const sessions = await findSessions({ user: userId, valid: true });

  return res.send(sessions);
}

export async function deleteSessionHandler(req: Request, res: Response) {
  const sessionId = res.locals.user.session;

  await updateSessions(
    {
      _id: sessionId,
    },
    { valid: false }
  );

  return res.send({
    accessToken: null,
    refeshToken: null,
  });
}
