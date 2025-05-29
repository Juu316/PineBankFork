/**
 * Calculates early loan repayment total using prorated simple interest
 * 
 * @param amount        - principal loan amount
 * @param interestRate  - annual interest rate (e.g., 0.05 for 5%)
 * @param startDate     - loan start date
 * @param payDate       - date loan is being paid
 * 
 * @returns { totalRepayment, interest, daysUsed }
 */
export function calculateEarlyRepayment(
    amount: number,
    interestRate: number,
    startDate: Date,
    payDate: Date
  ): {
    totalRepayment: number;
    interest: number;
    daysUsed: number;
  } {
    const msInDay = 1000 * 60 * 60 * 24;
    const daysUsed = Math.floor((payDate.getTime() - startDate.getTime()) / msInDay);
  
    const interest = amount * interestRate * (daysUsed / 365);
    const totalRepayment = amount + interest;
  
    return {
      totalRepayment: parseFloat(totalRepayment.toFixed(2)),
      interest: parseFloat(interest.toFixed(2)),
      daysUsed,
    };
  }
  
