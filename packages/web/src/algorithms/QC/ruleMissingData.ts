import { clamp } from 'lodash'

import type { AnalysisResult, NucleotideSubstitution } from 'src/algorithms/types'
import { getQCRuleStatus } from 'src/algorithms/QC/QCRuleStatus'

export interface QCRulesConfigMissingData {
  missingDataThreshold: number
  scoreBias: number
}

export function ruleMissingData(
  { nucleotideComposition }: AnalysisResult,
  _1: NucleotideSubstitution[],
  { missingDataThreshold, scoreBias }: QCRulesConfigMissingData,
) {
  const name = 'Missing data'
  const acronym = 'N'

  const totalMissing = nucleotideComposition.N ?? 0

  let score = ((totalMissing - scoreBias) * 100) / missingDataThreshold
  score = clamp(score, 0, Infinity)

  const status = getQCRuleStatus(score)

  return { name, acronym, score, totalMissing, missingDataThreshold: missingDataThreshold + scoreBias, status }
}

export type QCResultMissingData = ReturnType<typeof ruleMissingData>
