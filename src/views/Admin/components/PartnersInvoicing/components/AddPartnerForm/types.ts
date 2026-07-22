export interface TeamField {
    email: string;
    planOptionId: string;
}

export interface AddPartnerFormValues {
    partnerName: string;
    billingEmail: string;
    netTerms: string;
    teams: TeamField[];
}

export interface TeamPlanOption {
    id: string;
    label: string;
    priceInCents: number;
}
