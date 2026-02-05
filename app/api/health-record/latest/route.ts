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
