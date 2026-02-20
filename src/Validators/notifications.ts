import { z } from 'zod';

export const SenderModelEnum = z.enum(['Admin', 'Teacher']);

export const NotificationPayloadSchema = z.object({
  type: z.string().min(1, 'type is required'),

  title: z.string().min(1, 'title is required'),

  message: z.string().min(1, 'message is required'),

  link: z.string().url().optional(),

  attachmentUrl: z.string().url().optional(),

  sender: z.object({
    model: SenderModelEnum,
    id: z.string().min(1, 'sender id is required'),
  }),
});
