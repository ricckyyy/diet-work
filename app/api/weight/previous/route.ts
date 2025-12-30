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

		const userId = await getUserIdByEmail(session.user.email);
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
		return NextResponse.json(
			{ error: "Failed to fetch previous weight" },
			{ status: 500 }
		);
	}
}
