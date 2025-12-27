import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(request: NextRequest) {
	try {
		const session = await auth();

		if (!session?.user?.id) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

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
			where: {
				userId_date: {
					userId: session.user.id,
					date: normalizedDate,
				},
			},
		});

		let sideJobLog;
		if (existingLog) {
			// 存在する場合は、既存の分数に新しい分数を加算（アトミック操作）
			sideJobLog = await prisma.sideJobLog.update({
				where: {
					userId_date: {
						userId: session.user.id,
						date: normalizedDate,
					},
				},
				data: {
					minutes: { increment: minutesValue },
					...(memo && { memo }), // メモが提供された場合のみ更新
				},
			});
		} else {
			// 存在しない場合は新規作成
			sideJobLog = await prisma.sideJobLog.create({
				data: {
					userId: session.user.id,
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
