import { differenceInYears } from 'date-fns'
import type { AgeGroup } from '@/lib/supabase/types'

export function getAge(dateOfBirth: string | Date): number {
  return differenceInYears(new Date(), new Date(dateOfBirth))
}

export function getAgeGroup(dateOfBirth: string | Date): AgeGroup {
  const age = getAge(dateOfBirth)
  if (age >= 17) return 'older_teen'
  if (age >= 13) return 'teen'
  if (age >= 9)  return 'middle'
  return 'young'
}

export function isUnder13(dateOfBirth: string | Date): boolean {
  return getAge(dateOfBirth) < 13
}

export function isOver13(dateOfBirth: string | Date): boolean {
  return getAge(dateOfBirth) >= 13
}

export function ageGroupLabel(group: AgeGroup): string {
  const labels: Record<AgeGroup, string> = {
    young:      'Ages 5–8',
    middle:     'Ages 9–12',
    teen:       'Ages 13–16',
    older_teen: 'Ages 17–18',
  }
  return labels[group]
}

export function usesSeedInvesting(dateOfBirth: string | Date): boolean {
  return isUnder13(dateOfBirth)
}

export function usesRealInvesting(dateOfBirth: string | Date): boolean {
  return isOver13(dateOfBirth)
}

// Colors and themes per age group
export function ageGroupTheme(group: AgeGroup) {
  const themes = {
    young: {
      bg: 'bg-yellow-50',
      accent: 'bg-yellow-400',
      text: 'text-yellow-700',
      border: 'border-yellow-200',
      label: '⭐ Explorer',
    },
    middle: {
      bg: 'bg-blue-50',
      accent: 'bg-blue-400',
      text: 'text-blue-700',
      border: 'border-blue-200',
      label: '🚀 Learner',
    },
    teen: {
      bg: 'bg-sprout-50',
      accent: 'bg-sprout-500',
      text: 'text-sprout-700',
      border: 'border-sprout-200',
      label: '📈 Investor',
    },
    older_teen: {
      bg: 'bg-sprout-100',
      accent: 'bg-sprout-700',
      text: 'text-sprout-800',
      border: 'border-sprout-300',
      label: '💼 Trader',
    },
  }
  return themes[group]
}
