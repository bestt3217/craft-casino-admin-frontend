import { z } from 'zod'

// Updated to match backend bonus types
enum BonusType {
  WELCOME = 'welcome',
  DEPOSIT = 'deposit',
  // FREE_SPINS = 'free-spins',
  // RECURRING = 'recurring',
  // CUSTOM = 'custom',
  // DAILY = 'daily',
  // WEEKLY = 'weekly',
  // MONTHLY = 'monthly',
  // REFERRAL = 'referral',
}

enum BonusStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DRAFT = 'draft',
  EXPIRED = 'expired',
}

enum BonusEligibility {
  ALL = 'all',
  UTM = 'utm',
}

enum ClaimMethod {
  AUTO = 'auto',
  MANUAL = 'manual',
  CODE = 'code',
}

const bonusTypeOptions = Object.entries(BonusType)
  .map(([key, value]) => ({
    label: key.replace(/_/g, ' '),
    value,
  }))
  .filter((item) => ![BonusType.WELCOME].includes(item.value))

const statusOptions = Object.entries(BonusStatus).map(([key, value]) => ({
  label: key.toLowerCase(),
  value,
}))

const eligibilityOptions = Object.entries(BonusEligibility).map(
  ([key, value]) => ({
    label: key.toLowerCase(),
    value,
  })
)

// Simplified schema for basic bonus CRUD operations
export const bonusFormSchema = z
  .object({
    // Basic Information
    name: z.string().min(2, 'Bonus name is required'),
    description: z.string().min(2, 'Description is required'),
    type: z.nativeEnum(BonusType),
    status: z.nativeEnum(BonusStatus),
    eligibility: z.nativeEnum(BonusEligibility),
    bannerImage: z.any().optional(), // For image upload handling

    // Reward Configuration
    rewardType: z.enum(['real-money', 'free-spins', 'bonus']),
    defaultWageringMultiplier: z
      .number()
      .min(0, 'Wager amount is required')
      .default(35),

    // Real Money Reward Configuration
    cash: z
      .object({
        type: z.string().optional(),
        percentage: z.number().optional(),
        fixedAmount: z.number().optional(),
        maxAmount: z.number().optional(),
        depositCount: z.number().optional(),
      })
      .optional(),

    bonus: z
      .object({
        type: z.string().optional(),
        percentage: z.number().optional(),
        fixedAmount: z.number().optional(),
        maxAmount: z.number().optional(),
        depositCount: z.number().optional(),
      })
      .optional(),

    // Free Spins Reward Configuration
    freeSpins: z
      .object({
        amount: z.number().optional(),
        gameId: z.string().optional(),
        expiry: z.string().optional(),
      })
      .optional(),
  })
  .refine(
    (data) => {
      // If reward type is free-spins, gameId must be provided
      if (data.rewardType === 'free-spins') {
        return data.freeSpins?.gameId && data.freeSpins.gameId.trim().length > 0
      }
      return true
    },
    {
      message: 'Game ID is required for free spins rewards',
      path: ['freeSpins', 'gameId'],
    }
  )

export type BonusFormValues = z.infer<typeof bonusFormSchema>

export {
  BonusEligibility,
  BonusStatus,
  BonusType,
  bonusTypeOptions,
  ClaimMethod,
  eligibilityOptions,
  statusOptions,
}
