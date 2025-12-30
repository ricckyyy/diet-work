import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { getUserIdByEmail } from '@/lib/auth-helper-db';

export async function GET() {
	try {
		const session = await auth();

		if (!session?.user?.email) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const userId = await getUserIdByEmail(session.user.email);

		const now = new Date();
		const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

		// 今週の開始日（月曜日）
		const weekStart = new Date(today);
		const dayOfWeek = weekStart.getDay();
		const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // 日曜日は-6、それ以外は月曜日まで戻る
		weekStart.setDate(weekStart.getDate() + diff);

		// 今月の開始日
		const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

		// 今日の実績
		const todayLog = await prisma.sideJobLog.findFirst({
			where: {
				userId,
				date: today,
			},
		});

		// 今週の合計
		const weekLogs = await prisma.sideJobLog.findMany({
			where: {
				userId,
				date: {
					gte: weekStart,
					lte: today,
				},
			},
		});
		const weekTotal = weekLogs.reduce((sum, log) => sum + log.minutes, 0);

		// 今月の合計
		const monthLogs = await prisma.sideJobLog.findMany({
			where: {
				userId,
				date: {
					gte: monthStart,
					lte: today,
				},
			},
		});
		const monthTotal = monthLogs.reduce((sum, log) => sum + log.minutes, 0);

		return NextResponse.json({
			today: todayLog?.minutes || 0,
			week: {
				total: weekTotal,
				count: weekLogs.length,
			},
			month: {
				total: monthTotal,
				count: monthLogs.length,
			},
		});
	} catch (error) {
		console.error("Error fetching side job stats:", error);
		return NextResponse.json(
			{ error: "Failed to fetch side job stats" },
			{ status: 500 }
		);
	}
}
