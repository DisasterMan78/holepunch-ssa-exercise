import { NextRequest } from "next/server";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const POST = async (request: NextRequest) => {
  return new Response(JSON.stringify({
      unbuiltAPI: true,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
}