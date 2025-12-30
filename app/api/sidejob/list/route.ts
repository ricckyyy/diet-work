import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { getUserIdByEmail } from '@/lib/auth-helper-db';

export async function GET(request: NextRequest) {
	try {
		const session = await auth();

		if (!session?.user?.email) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const userId = await getUserIdByEmail(session.user.email);

		const { searchParams } = new URL(request.url);
		const limit = parseInt(searchParams.get("limit") || "10");

		const logs = await prisma.sideJobLog.findMany({
			where: { userId: userId },
			orderBy: { date: "desc" },
			take: limit,
		});

		return NextResponse.json(logs);
	} catch (error) {
		console.error("Error fetching side job logs:", error);
		return NextResponse.json(
			{ error: "Failed to fetch side job logs" },
			{ status: 500 }
		);
	}
}
