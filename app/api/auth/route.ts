import { NextResponse } from 'next/server';
import { validateTelegramWebAppData } from '@/utils/teleAuth';
import { cookies } from 'next/headers';
import { encrypt, SESSION_DURATION } from '@/utils/session';


// Define the User type
interface User {
  telegramId: string;
  role: string; // You can assign a default value or derive it from some logic
}

export async function POST(request: Request) {
  const { initData } = await request.json();

  // Validate the Telegram Web App data
  const validationResult = validateTelegramWebAppData(initData);

  if (validationResult.validatedData) {
    console.log("Validation result: ", validationResult);

    if (!validationResult.user.id) {
        throw new Error("Telegram ID is missing");
      }
      
    // Create the user object with telegramId and role
    const user: User = {
      telegramId: validationResult.user.id,
      role: 'user', // Set a role for the user, you can change this logic
    };

    // Create a new session
    const expires = new Date(Date.now() + SESSION_DURATION);
    const session = await encrypt({ user, role: user?.role, expires });

    // Save the session in a cookie
    cookies().set("session", session, { expires, httpOnly: true });

    return NextResponse.json({ message: 'Authentication successful' });
  } else {
    return NextResponse.json({ message: validationResult.message }, { status: 401 });
  }
}
