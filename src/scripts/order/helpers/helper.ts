export function roundAmountOnTwoDecimals(amount: number): number {
    return parseFloat(amount.toFixed(2));
}

export function transformCentAmountToAmount(
    centAmount: number,
    fractionDigits: number,
): number {
    const factorOfTen = Math.pow(10, fractionDigits);
    return Math.round((centAmount / factorOfTen) * 100) / 100;
}


export function transformAmountToCentAmount(
    amount: string,
): number {
    let fractionDigits = 2;
    if (amount.indexOf('.') >= 0) {
        fractionDigits = amount?.split('.')[1].length;
    }
    const factorOfTen = Math.pow(10, fractionDigits);
    return Math.round(Number(amount) * factorOfTen);
}