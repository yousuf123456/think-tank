import { Liveblocks } from "@liveblocks/node";
import { NextResponse } from "next/server";

import { auth, currentUser } from "@clerk/nextjs";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";

const liveblocks = new Liveblocks({
  secret:
    "sk_dev_Dap-VKjelyDUYyUL6AVMy8_nDR2Osjti1EkzKT-WO7BZwgOTvFBa__gt_k2wJeVI",
});

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(request: Request) {
  try {
    const authentication = auth();
    const user = await currentUser();

    if (!user || !authentication)
      return new Response("Unauthorized", { status: 403 });

    const { room } = await request.json();

    const liveblock_session = liveblocks.prepareSession(user.id, {
      userInfo: {
        name: user.firstName || "Member",
        image: user.imageUrl,
      },
    });

    const board = await convex.query(api.board.getBoard, { boardId: room });

    if (!(board?.orgId === authentication.orgId))
      return new Response("Unauthorized", { status: 403 });

    if (board) {
      liveblock_session.allow(room, liveblock_session.FULL_ACCESS);
    }

    const { status, body } = await liveblock_session.authorize();

    return new Response(body, { status });
  } catch (e) {
    console.log(e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
