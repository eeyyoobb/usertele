import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// Define a type for the session payload
type User = {
    telegramId: string;
    username?: string;
    role: string;
  };
  
  type SessionPayload = {
    user: User; // User is an object with role
    expires: Date | string; // Adjust this based on your usage
    role: string;
  };
  

const key = new TextEncoder().encode(process.env.JWT_SECRET);

export const SESSION_DURATION = 60 * 60 * 1000; // 1 hour

export async function encrypt(payload: SessionPayload): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1 hour")
    .sign(key);
}

export async function decrypt(input: string): Promise<SessionPayload> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  // Type assertion to ensure payload matches the expected shape
  return payload as SessionPayload;
}

export async function getSession(): Promise<SessionPayload | null> {
  const session = cookies().get("session")?.value;
  console.log("Session value in getSession: ", session);
  if (!session) return null;

  try {
    return await decrypt(session);
  } catch (error) {
    console.error("Failed to decrypt session:", error);
    return null;
  }
}

export async function updateSession(request: NextRequest): Promise<NextResponse | undefined> {
  const session = request.cookies.get("session")?.value;
  if (!session) return;

  try {
    const parsed = await decrypt(session);
    parsed.expires = new Date(Date.now() + SESSION_DURATION);

    const res = NextResponse.next();
    res.cookies.set({
      name: "session",
      value: await encrypt(parsed),
      httpOnly: true,
      expires: new Date(parsed.expires),
    });

    return res;
  } catch (error) {
    console.error("Failed to update session:", error);
    return undefined;
  }
}
