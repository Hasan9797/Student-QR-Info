import cron from 'node-cron'
import studentsService from '../services/students.service.js'

export const initPartitionCleanupJob = () => {
	cron.schedule(
		'0 0 * * *',
		async () => {
			try {
				console.log('--- AUTO-CLEANUP START ---')
				const result = await studentsService.dropStPartitionTable()
			} catch (error) {}
		},
		{
			scheduled: true,
			timezone: 'Asia/Tashkent',
		},
	)

	console.log('✅ Partition cleanup cron job initialized (Every day at 00:00)')
}
