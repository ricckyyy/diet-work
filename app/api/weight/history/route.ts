import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { getUserIdByEmail } from "@/lib/auth-helper-db";

export async function GET(request: NextRequest) {
	try {
		const session = await auth();

		if (!session?.user?.email) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const userId = await getUserIdByEmail(session.user.email);
		const { searchParams } = new URL(request.url);
		const limit = parseInt(searchParams.get("limit") || "30");

		const weights = await prisma.weight.findMany({
			where: { userId },
			orderBy: { date: "asc" },
			take: limit,
		});

		return NextResponse.json(weights);
	} catch (error) {
		console.error("Error fetching weight history:", error);
		return NextResponse.json(
			{ error: "Failed to fetch weight history" },
			{ status: 500 }
		);
	}
}
