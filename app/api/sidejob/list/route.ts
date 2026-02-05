import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUserId } from "@/lib/auth-helper";

export async function GET(request: NextRequest) {
	try {
		const userId = await getAuthUserId();

		const { searchParams } = new URL(request.url);
		const limit = parseInt(searchParams.get("limit") || "10");

		const logs = await prisma.sideJobLog.findMany({
			where: { userId },
			orderBy: { date: "desc" },
			take: limit,
		});

		return NextResponse.json(logs);
	} catch (error) {
		console.error("Error fetching side job logs:", error);
		if (error instanceof Error && error.message === "Unauthorized") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
		return NextResponse.json(
			{ error: "Failed to fetch side job logs" },
			{ status: 500 }
		);
	}
}
