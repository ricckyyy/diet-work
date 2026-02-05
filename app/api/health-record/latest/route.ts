import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { getUserIdByEmail } from "@/lib/auth-helper-db";

export async function GET() {
	try {
		const session = await auth();

		if (!session?.user?.email) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// emailからuserIdを取得
		const userId = await getUserIdByEmail(session.user.email);

		const latestRecord = await prisma.healthRecord.findFirst({
			where: { userId },
			orderBy: { date: "desc" },
		});

		if (!latestRecord) {
			return NextResponse.json(null);
		}

		return NextResponse.json(latestRecord);
	} catch (error) {
		console.error("Error fetching latest health record:", error);
		return NextResponse.json(
			{ error: "Failed to fetch latest health record" },
			{ status: 500 }
		);
	}
}
