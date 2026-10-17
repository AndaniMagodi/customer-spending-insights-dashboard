import { z } from 'zod'

const AppConfigSchema = z.object({
  apiUrl: z.string().url().or(z.literal('')),
  mockApi: z.boolean(),
})

export type AppConfig = z.infer<typeof AppConfigSchema>

declare global {
  interface Window {
    __APP_CONFIG__: AppConfig
  }
}

export async function loadAppConfig(): Promise<AppConfig> {
  const response = await fetch('/config.json', { cache: 'no-store' })
  if (!response.ok) throw new Error('Application configuration could not be loaded.')
  return AppConfigSchema.parse(await response.json())
}
