/**
 * Financial Health Score Calculator
 * Calculates a score from 0-1000 based on various financial metrics
 */

export interface FinancialMetrics {
    totalIncome: number; // monthly income in paisa
    totalExpense: number; // monthly expense in paisa
    savingsAmount: number; // monthly savings in paisa
    budgetAdherence: number; // percentage (0-100)
    goalsProgress: number; // average progress of goals (0-100)
    debtAmount: number; // total debt in paisa
    emergencyFund: number; // emergency fund in paisa
    transactionCount: number; // number of transactions
}

export interface HealthScoreBreakdown {
    score: number;
    rating: 'Excellent' | 'Good' | 'Fair' | 'Needs Improvement' | 'Poor';
    breakdown: {
        savingsRate: { score: number; weight: number };
        budgetAdherence: { score: number; weight: number };
        goalsProgress: { score: number; weight: number };
        debtRatio: { score: number; weight: number };
        emergencyFund: { score: number; weight: number };
        consistency: { score: number; weight: number };
    };
    recommendations: string[];
}

const WEIGHTS = {
    savingsRate: 0.25,      // 25%
    budgetAdherence: 0.20,  // 20%
    goalsProgress: 0.20,    // 20%
    debtRatio: 0.15,        // 15%
    emergencyFund: 0.15,    // 15%
    consistency: 0.05,      // 5%
};

/**
 * Calculate savings rate score (0-100)
 */
function calculateSavingsRateScore(income: number, savings: number): number {
    if (income <= 0) return 0;
    
    const savingsRate = (savings / income) * 100;
    
    if (savingsRate >= 30) return 100; // Excellent: 30%+ savings
    if (savingsRate >= 20) return 85;  // Great: 20-30% savings
    if (savingsRate >= 10) return 70;  // Good: 10-20% savings
    if (savingsRate >= 5) return 50;   // Fair: 5-10% savings
    if (savingsRate > 0) return 30;    // Poor: >0% but <5% savings
    return 0;                           // No savings
}

/**
 * Calculate budget adherence score (0-100)
 */
function calculateBudgetAdherenceScore(adherence: number): number {
    return Math.min(adherence, 100);
}

/**
 * Calculate goals progress score (0-100)
 */
function calculateGoalsProgressScore(progress: number): number {
    return Math.min(progress, 100);
}

/**
 * Calculate debt ratio score (0-100)
 */
function calculateDebtRatioScore(income: number, debt: number): number {
    if (income <= 0) return 50;
    if (debt <= 0) return 100; // No debt is excellent
    
    const debtToIncomeRatio = (debt / income) * 100;
    
    if (debtToIncomeRatio <= 10) return 100; // Excellent: <10%
    if (debtToIncomeRatio <= 20) return 85;  // Good: 10-20%
    if (debtToIncomeRatio <= 35) return 70;  // Fair: 20-35%
    if (debtToIncomeRatio <= 50) return 50;  // Poor: 35-50%
    return 30;                                // Very poor: >50%
}

/**
 * Calculate emergency fund score (0-100)
 */
function calculateEmergencyFundScore(monthlyExpense: number, emergencyFund: number): number {
    if (monthlyExpense <= 0) return 50;
    
    const monthsCovered = emergencyFund / monthlyExpense;
    
    if (monthsCovered >= 6) return 100;  // Excellent: 6+ months
    if (monthsCovered >= 3) return 85;   // Good: 3-6 months
    if (monthsCovered >= 1) return 70;   // Fair: 1-3 months
    if (monthsCovered > 0) return 40;    // Poor: <1 month
    return 0;                             // No emergency fund
}

/**
 * Calculate consistency score (0-100)
 * Based on transaction count - more transactions indicate better tracking
 */
function calculateConsistencyScore(transactionCount: number): number {
    if (transactionCount >= 50) return 100; // Excellent tracking
    if (transactionCount >= 30) return 85;  // Good tracking
    if (transactionCount >= 15) return 70;  // Fair tracking
    if (transactionCount >= 5) return 50;   // Poor tracking
    if (transactionCount > 0) return 30;    // Very poor tracking
    return 0;                                // No tracking
}

/**
 * Get rating based on score
 */
function getRating(score: number): 'Excellent' | 'Good' | 'Fair' | 'Needs Improvement' | 'Poor' {
    if (score >= 800) return 'Excellent';
    if (score >= 650) return 'Good';
    if (score >= 500) return 'Fair';
    if (score >= 350) return 'Needs Improvement';
    return 'Poor';
}

/**
 * Generate recommendations based on scores
 */
function generateRecommendations(breakdown: HealthScoreBreakdown['breakdown'], metrics: FinancialMetrics): string[] {
    const recommendations: string[] = [];
    
    // Savings rate recommendations
    if (breakdown.savingsRate.score < 70) {
        const savingsRate = (metrics.savingsAmount / metrics.totalIncome) * 100;
        if (savingsRate < 10) {
            recommendations.push('Try to save at least 10% of your income. Start with a small percentage and gradually increase it.');
        } else {
            recommendations.push('Aim to save 20-30% of your income for optimal financial health.');
        }
    }
    
    // Budget adherence recommendations
    if (breakdown.budgetAdherence.score < 70) {
        recommendations.push('Review your budget regularly and adjust categories based on actual spending patterns.');
    }
    
    // Goals progress recommendations
    if (breakdown.goalsProgress.score < 70) {
        recommendations.push('Set specific, measurable financial goals and track them regularly.');
    }
    
    // Debt recommendations
    if (breakdown.debtRatio.score < 70) {
        recommendations.push('Focus on reducing debt by allocating more funds to high-interest debts first.');
    }
    
    // Emergency fund recommendations
    if (breakdown.emergencyFund.score < 85) {
        const monthsCovered = metrics.emergencyFund / metrics.totalExpense;
        if (monthsCovered < 3) {
            recommendations.push('Build an emergency fund covering at least 3-6 months of expenses.');
        } else {
            recommendations.push('Aim for an emergency fund covering 6 months of expenses for maximum security.');
        }
    }
    
    // Consistency recommendations
    if (breakdown.consistency.score < 70) {
        recommendations.push('Track all your transactions consistently to get better insights into your spending.');
    }
    
    // If score is excellent
    if (breakdown.savingsRate.score >= 85 && breakdown.emergencyFund.score >= 85) {
        recommendations.push('Your financial health is excellent! Consider exploring investment opportunities.');
    }
    
    return recommendations;
}

/**
 * Calculate overall financial health score
 */
export function calculateFinancialHealthScore(metrics: FinancialMetrics): HealthScoreBreakdown {
    // Calculate individual scores
    const savingsRateScore = calculateSavingsRateScore(metrics.totalIncome, metrics.savingsAmount);
    const budgetAdherenceScore = calculateBudgetAdherenceScore(metrics.budgetAdherence);
    const goalsProgressScore = calculateGoalsProgressScore(metrics.goalsProgress);
    const debtRatioScore = calculateDebtRatioScore(metrics.totalIncome, metrics.debtAmount);
    const emergencyFundScore = calculateEmergencyFundScore(metrics.totalExpense, metrics.emergencyFund);
    const consistencyScore = calculateConsistencyScore(metrics.transactionCount);
    
    // Create breakdown
    const breakdown = {
        savingsRate: { score: savingsRateScore, weight: WEIGHTS.savingsRate },
        budgetAdherence: { score: budgetAdherenceScore, weight: WEIGHTS.budgetAdherence },
        goalsProgress: { score: goalsProgressScore, weight: WEIGHTS.goalsProgress },
        debtRatio: { score: debtRatioScore, weight: WEIGHTS.debtRatio },
        emergencyFund: { score: emergencyFundScore, weight: WEIGHTS.emergencyFund },
        consistency: { score: consistencyScore, weight: WEIGHTS.consistency },
    };
    
    // Calculate weighted score (0-100)
    const rawScore = 
        savingsRateScore * WEIGHTS.savingsRate +
        budgetAdherenceScore * WEIGHTS.budgetAdherence +
        goalsProgressScore * WEIGHTS.goalsProgress +
        debtRatioScore * WEIGHTS.debtRatio +
        emergencyFundScore * WEIGHTS.emergencyFund +
        consistencyScore * WEIGHTS.consistency;
    
    // Convert to 0-1000 scale
    const score = Math.round(rawScore * 10);
    
    // Get rating
    const rating = getRating(score);
    
    // Generate recommendations
    const recommendations = generateRecommendations(breakdown, metrics);
    
    return {
        score,
        rating,
        breakdown,
        recommendations,
    };
}

/**
 * Get score color based on rating
 */
export function getScoreColor(score: number): string {
    if (score >= 800) return '#22c55e'; // green
    if (score >= 650) return '#0ea5e9'; // blue
    if (score >= 500) return '#f59e0b'; // orange
    if (score >= 350) return '#ef4444'; // red
    return '#991b1b'; // dark red
}

/**
 * Get score emoji based on rating
 */
export function getScoreEmoji(score: number): string {
    if (score >= 800) return '🏆';
    if (score >= 650) return '🎯';
    if (score >= 500) return '📊';
    if (score >= 350) return '⚠️';
    return '🚨';
}
