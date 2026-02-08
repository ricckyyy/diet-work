import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUserId } from "@/lib/auth-helper";

// 数値パース用ヘルパー関数
const parseOptionalFloat = (value: unknown): number | undefined => {
	if (value === undefined || value === null) return undefined;
	if (typeof value === 'number') return !isNaN(value) ? value : undefined;
	if (typeof value !== 'string') return undefined;
	const parsed = parseFloat(value);
	return !isNaN(parsed) ? parsed : undefined;
};

const parseOptionalInt = (value: unknown): number | undefined => {
	if (value === undefined || value === null) return undefined;
	if (typeof value === 'number') return !isNaN(value) ? Math.floor(value) : undefined;
	if (typeof value !== 'string') return undefined;
	const parsed = parseInt(value);
	return !isNaN(parsed) ? parsed : undefined;
};

const parseOptionalString = (value: unknown): string | undefined => {
	if (value === undefined || value === null) return undefined;
	if (typeof value !== 'string') return undefined;
	return value;
};

export async function POST(request: NextRequest) {
	try {
		const userId = await getAuthUserId();

		const body = await request.json();
		const {
			date,
			rawInput,
			weight,
			bodyTemp,
			sleepHours,
			waterIntake,
			steps,
			meals,
			activities,
			notes
		} = body;

		if (!date || !rawInput) {
			return NextResponse.json(
				{ error: "date and rawInput are required" },
				{ status: 400 }
			);
		}

		if (typeof rawInput === 'string' && rawInput.length > 5000) {
			return NextResponse.json(
				{ error: "rawInput must be 5000 characters or less" },
				{ status: 400 }
			);
		}

		// 日付をUTC 00:00:00に正規化
		const normalizedDate = new Date(date);
		normalizedDate.setUTCHours(0, 0, 0, 0);

		// データをパースして共通のオブジェクトを作成
		const recordData = {
			rawInput,
			weight: parseOptionalFloat(weight),
			bodyTemp: parseOptionalFloat(bodyTemp),
			sleepHours: parseOptionalFloat(sleepHours),
			waterIntake: parseOptionalFloat(waterIntake),
			steps: parseOptionalInt(steps),
			meals: parseOptionalString(meals),
			activities: parseOptionalString(activities),
			notes: parseOptionalString(notes),
		};

		// upsert: 存在すれば更新、なければ作成
		const healthRecord = await prisma.healthRecord.upsert({
			where: {
				userId_date: {
					userId,
					date: normalizedDate,
				},
			},
			update: recordData,
			create: {
				userId,
				date: normalizedDate,
				...recordData,
			},
		});

		return NextResponse.json(healthRecord);
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
		const limitParam = parseInt(searchParams.get("limit") || "30") || 30;
		const offsetParam = parseInt(searchParams.get("offset") || "0") || 0;

		// パラメータのバリデーション
		const limit = Math.min(Math.max(limitParam, 1), 100); // 1〜100の範囲
		const offset = Math.max(offsetParam, 0); // 0以上

		const healthRecords = await prisma.healthRecord.findMany({
			where: { userId },
			orderBy: { date: "desc" },
			take: limit,
			skip: offset,
		});

		return NextResponse.json(healthRecords);
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
