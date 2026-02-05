import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUserId } from "@/lib/auth-helper";

export async function GET() {
	try {
		const userId = await getAuthUserId();
		const latestWeight = await prisma.weight.findFirst({
			where: { userId },
			orderBy: { date: "desc" },
		});

		if (!latestWeight) {
			return NextResponse.json(
				{ error: "No weight data found" },
				{ status: 404 }
			);
		}

		return NextResponse.json(latestWeight);
	} catch (error) {
		console.error("Error fetching latest weight:", error);
		if (error instanceof Error && error.message === "Unauthorized") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
		return NextResponse.json(
			{ error: "Failed to fetch latest weight" },
			{ status: 500 }
		);
	}
}
