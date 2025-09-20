
import { NextResponse } from 'next/server';
import { cleanupTask } from '@/ai/flows/cleanup-task';
import { logger } from '@/lib/logger';

export async function POST(req: Request) {
  const serviceContext = { service: 'test-cleanup' };

  try {
    const { rawTask } = await req.json();

    if (!rawTask || typeof rawTask !== 'string') {
      logger.warn('Validation Error: rawTask is missing or not a string.', {
        ...serviceContext,
        status: 400
      });
      return NextResponse.json({ message: 'Validation Error: rawTask must be a non-empty string.' }, { status: 400 });
    }

    logger.info(`Received task for cleanup: "${rawTask}"`, serviceContext);

    const cleanedData = await cleanupTask(rawTask);

    logger.info(`Successfully cleaned task: "${rawTask}"`, {
      ...serviceContext,
      request: rawTask,
      response: cleanedData
    });

    return NextResponse.json(cleanedData);

  } catch (error: any) {
    logger.error('Error during single task cleanup.', {
      ...serviceContext,
      error: {
        message: error.message,
        stack: error.stack,
      },
    });
    return NextResponse.json({ message: 'An error occurred during cleanup.', error: error.message }, { status: 500 });
  }
}
