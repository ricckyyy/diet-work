import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
	try {
		const { date, minutes, memo } = await request.json();

		if (!date || minutes === undefined) {
			return NextResponse.json(
				{ error: "date and minutes are required" },
				{ status: 400 }
			);
		}

		const minutesValue = parseInt(minutes);
		if (isNaN(minutesValue) || minutesValue < 0) {
			return NextResponse.json(
				{ error: "minutes must be a valid positive number" },
				{ status: 400 }
			);
		}

		// 日付を00:00:00に正規化
		const normalizedDate = new Date(date);
		normalizedDate.setHours(0, 0, 0, 0);

		// 既存のレコードを確認
		const existingLog = await prisma.sideJobLog.findUnique({
			where: { date: normalizedDate },
		});

		let sideJobLog;
		if (existingLog) {
			// 存在する場合は、既存の分数に新しい分数を加算
			sideJobLog = await prisma.sideJobLog.update({
				where: { date: normalizedDate },
				data: {
					minutes: existingLog.minutes + minutesValue,
					memo: memo || existingLog.memo, // メモは新しい値があれば更新
				},
			});
		} else {
			// 存在しない場合は新規作成
			sideJobLog = await prisma.sideJobLog.create({
				data: {
					date: normalizedDate,
					minutes: minutesValue,
					memo: memo || null,
				},
			});
		}

		return NextResponse.json(sideJobLog);
	} catch (error) {
		console.error("Error saving side job log:", error);
		return NextResponse.json(
			{ error: "Failed to save side job log" },
			{ status: 500 }
		);
	}
}
