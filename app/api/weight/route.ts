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

		const { date, value } = await request.json();

		if (!date || value === undefined) {
			return NextResponse.json(
				{ error: "date and value are required" },
				{ status: 400 }
			);
		}

		const weightValue = parseFloat(value);
		if (isNaN(weightValue)) {
			return NextResponse.json(
				{ error: "value must be a valid number" },
				{ status: 400 }
			);
		}

		// 日付を00:00:00に正規化
		const normalizedDate = new Date(date);
		normalizedDate.setHours(0, 0, 0, 0);

		// upsert: 存在すれば更新、なければ作成
		const weight = await prisma.weight.upsert({
			where: {
				userId_date: {
					userId: userId,
					date: normalizedDate,
				},
			},
			update: { value: weightValue },
			create: {
				userId: userId,
				date: normalizedDate,
				value: weightValue,
			},
		});

		return NextResponse.json(weight);
	} catch (error) {
		console.error("Error saving weight:", error);
		return NextResponse.json(
			{ error: "Failed to save weight" },
			{ status: 500 }
		);
	}
}
