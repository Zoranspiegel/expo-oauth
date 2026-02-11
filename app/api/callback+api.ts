import { APP_SCHEME, BASE_URL } from "@/constants";

export async function GET(request: Request) {
  const incomingParams = new URL(request.url).searchParams;
  const combinedPlatformAndState = incomingParams.get("state");

  if (!combinedPlatformAndState) {
    return Response.json({ error: "Invalid state" }, { status: 400 });
  }

  const platform = combinedPlatformAndState.split("|")[0];
  const state = combinedPlatformAndState.split("|")[1];

  const outgoingParams = new URLSearchParams({
    code: incomingParams.get("code")?.toString() || "",
    state,
  });

  return Response.redirect((platform === "web" ? BASE_URL : APP_SCHEME) + "?" + outgoingParams.toString());
}
