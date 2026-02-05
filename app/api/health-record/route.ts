import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { getUserIdByEmail } from "@/lib/auth-helper-db";

export async function POST(request: NextRequest) {
	try {
		const session = await auth();

		if (!session?.user?.email) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// emailからuserIdを取得
		const userId = await getUserIdByEmail(session.user.email);

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

		// 日付を00:00:00に正規化
		const normalizedDate = new Date(date);
		normalizedDate.setHours(0, 0, 0, 0);

		// データをパースして共通のオブジェクトを作成
		const recordData = {
			rawInput,
			weight: weight !== undefined ? (() => {
				const parsed = parseFloat(weight);
				return !isNaN(parsed) ? parsed : undefined;
			})() : undefined,
			bodyTemp: bodyTemp !== undefined ? (() => {
				const parsed = parseFloat(bodyTemp);
				return !isNaN(parsed) ? parsed : undefined;
			})() : undefined,
			sleepHours: sleepHours !== undefined ? (() => {
				const parsed = parseFloat(sleepHours);
				return !isNaN(parsed) ? parsed : undefined;
			})() : undefined,
			waterIntake: waterIntake !== undefined ? (() => {
				const parsed = parseFloat(waterIntake);
				return !isNaN(parsed) ? parsed : undefined;
			})() : undefined,
			steps: steps !== undefined ? (() => {
				const parsed = parseInt(steps);
				return !isNaN(parsed) ? parsed : undefined;
			})() : undefined,
			meals,
			activities,
			notes,
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
		return NextResponse.json(
			{ error: "Failed to save health record" },
			{ status: 500 }
		);
	}
}

export async function GET(request: NextRequest) {
	try {
		const session = await auth();

		if (!session?.user?.email) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// emailからuserIdを取得
		const userId = await getUserIdByEmail(session.user.email);

		const { searchParams } = new URL(request.url);
		const limit = parseInt(searchParams.get("limit") || "30");
		const offset = parseInt(searchParams.get("offset") || "0");

		const healthRecords = await prisma.healthRecord.findMany({
			where: { userId },
			orderBy: { date: "desc" },
			take: limit,
			skip: offset,
		});

		return NextResponse.json(healthRecords);
	} catch (error) {
		console.error("Error fetching health records:", error);
		return NextResponse.json(
			{ error: "Failed to fetch health records" },
			{ status: 500 }
		);
	}
}
