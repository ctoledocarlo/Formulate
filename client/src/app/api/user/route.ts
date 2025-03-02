import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookiesObj = await cookies();
  const token = cookiesObj.get("sessionid")?.value;
  
  console.log("Token: ", token);

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ message: "Authenticated User", token });
}
