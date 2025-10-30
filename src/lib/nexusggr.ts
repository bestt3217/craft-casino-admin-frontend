import { z } from 'zod'

export const nexusggrSettingSchema = z.object({
  rtp: z.number().min(0).max(100),
  ggr: z.number().min(0).max(100),
})

export type NexusggrSettingSchema = z.infer<typeof nexusggrSettingSchema>

export const nexusggrRtpSchema = z.object({
  rtp: z.number().min(0).max(100),
})

export type NexusggrRtpSchema = z.infer<typeof nexusggrRtpSchema>
