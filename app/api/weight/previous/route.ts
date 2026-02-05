import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUserId } from "@/lib/auth-helper";

export async function GET() {
	try {
		const userId = await getAuthUserId();
		// 最新の日付を取得
		const latest = await prisma.weight.findFirst({
			where: { userId },
			orderBy: { date: "desc" },
		});

		if (!latest) {
			return NextResponse.json(
				{ error: "No weight data found" },
				{ status: 404 }
			);
		}

		// 最新の日付より前のデータを取得
		const previousWeight = await prisma.weight.findFirst({
			where: {
				userId,
				date: { lt: latest.date },
			},
			orderBy: { date: "desc" },
		});

		if (!previousWeight) {
			return NextResponse.json(
				{ error: "No previous weight data found" },
				{ status: 404 }
			);
		}

		return NextResponse.json(previousWeight);
	} catch (error) {
		console.error("Error fetching previous weight:", error);
		if (error instanceof Error && error.message === "Unauthorized") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
		return NextResponse.json(
			{ error: "Failed to fetch previous weight" },
			{ status: 500 }
		);
	}
}
