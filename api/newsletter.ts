interface ApiRequest {
  method?: string;
  body?: unknown;
}

interface ApiResponse {
  status(code: number): ApiResponse;
  json(body: { error?: string; subscribed?: boolean }): void;
  setHeader(name: string, value: string): void;
}

declare const process: {
  env: Record<string, string | undefined>;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(request: ApiRequest, response: ApiResponse) {
  response.setHeader("Allow", "POST");

  if (request.method !== "POST") {
    response.status(405).json({ error: "Method not allowed." });
    return;
  }

  const apiKey = process.env.MAILERLITE_API_KEY;
  const groupId = process.env.MAILERLITE_GROUP_ID;
  if (!apiKey || !groupId) {
    console.error("[newsletter] MailerLite environment variables are not configured.");
    response.status(500).json({ error: "Newsletter signup is temporarily unavailable." });
    return;
  }

  const body = request.body as { email?: unknown } | null;
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!email || email.length > 254 || !EMAIL_PATTERN.test(email)) {
    response.status(400).json({ error: "Enter a valid email address." });
    return;
  }

  try {
    const mailerLiteResponse = await fetch("https://connect.mailerlite.com/api/subscribers", {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        groups: [groupId],
        status: "active",
      }),
    });

    if (!mailerLiteResponse.ok && mailerLiteResponse.status !== 409) {
      console.error("[newsletter] MailerLite request failed:", mailerLiteResponse.status);
      response.status(502).json({ error: "Newsletter signup is temporarily unavailable." });
      return;
    }

    response.status(200).json({ subscribed: true });
  } catch (error) {
    console.error("[newsletter] MailerLite request failed:", error);
    response.status(502).json({ error: "Newsletter signup is temporarily unavailable." });
  }
}
