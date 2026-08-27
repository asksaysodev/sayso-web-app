// The form holds netTerms as a string, Partner holds it as a number.
export function formatNetTerms(netTerms: number | string): string {
    return Number(netTerms) === 0 ? 'Due on receipt' : `Net ${netTerms}`;
}
