import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUserId } from "@/lib/auth-helper";

export async function GET() {
	try {
		const userId = await getAuthUserId();

		const latestRecord = await prisma.healthRecord.findFirst({
			where: { userId },
			orderBy: { date: "desc" },
		});

		if (!latestRecord) {
			return NextResponse.json(
				{ error: "No health record data found" },
				{ status: 404 }
			);
		}

		return NextResponse.json(latestRecord);
	} catch (error) {
		console.error("Error fetching latest health record:", error);
		if (error instanceof Error && error.message === "Unauthorized") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
		return NextResponse.json(
			{ error: "Failed to fetch latest health record" },
			{ status: 500 }
		);
	}
}
