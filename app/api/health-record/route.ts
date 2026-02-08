import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUserId } from "@/lib/auth-helper";

export async function POST(request: NextRequest) {
	try {
		const userId = await getAuthUserId();
		const body = await request.json();

		const { date, rawInput, weight, bodyTemp, sleepHours, waterIntake, steps, meals, activities, notes } = body;

		if (!date || !rawInput) {
			return NextResponse.json(
				{ error: "date and rawInput are required" },
				{ status: 400 }
			);
		}

		const normalizedDate = new Date(date);
		normalizedDate.setHours(0, 0, 0, 0);

		const record = await prisma.healthRecord.upsert({
			where: {
				userId_date: {
					userId,
					date: normalizedDate,
				},
			},
			update: {
				rawInput,
				weight: weight ?? null,
				bodyTemp: bodyTemp ?? null,
				sleepHours: sleepHours ?? null,
				waterIntake: waterIntake ?? null,
				steps: steps ?? null,
				meals: meals ?? null,
				activities: activities ?? null,
				notes: notes ?? null,
			},
			create: {
				userId,
				date: normalizedDate,
				rawInput,
				weight: weight ?? null,
				bodyTemp: bodyTemp ?? null,
				sleepHours: sleepHours ?? null,
				waterIntake: waterIntake ?? null,
				steps: steps ?? null,
				meals: meals ?? null,
				activities: activities ?? null,
				notes: notes ?? null,
			},
		});

		return NextResponse.json(record);
	} catch (error) {
		console.error("Error saving health record:", error);
		if (error instanceof Error && error.message === "Unauthorized") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
		return NextResponse.json(
			{ error: "Failed to save health record" },
			{ status: 500 }
		);
	}
}

export async function GET(request: NextRequest) {
	try {
		const userId = await getAuthUserId();
		const { searchParams } = new URL(request.url);
		const limit = parseInt(searchParams.get("limit") || "30");
		const offset = parseInt(searchParams.get("offset") || "0");

		const records = await prisma.healthRecord.findMany({
			where: { userId },
			orderBy: { date: "desc" },
			take: limit,
			skip: offset,
		});

		return NextResponse.json(records);
	} catch (error) {
		console.error("Error fetching health records:", error);
		if (error instanceof Error && error.message === "Unauthorized") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
		return NextResponse.json(
			{ error: "Failed to fetch health records" },
			{ status: 500 }
		);
	}
}
