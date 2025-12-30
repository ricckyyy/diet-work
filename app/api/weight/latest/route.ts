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
		return NextResponse.json(
			{ error: "Failed to fetch latest weight" },
			{ status: 500 }
		);
	}
}
