import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.rewrite(new URL("/login", req.url)); //redirect to login
  }
  return res;
}

export const config = {
  //slap all auth-locked page names in?
  matcher: [
    //"/about:path", //test for later
    "/((?!api|_next/static|_next/image|favicon.ico).*)", //matches on all but these here
  ],
};
