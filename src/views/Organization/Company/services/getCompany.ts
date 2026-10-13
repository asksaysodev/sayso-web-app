import apiClient from "@/config/axios";
import type { Company } from "../types";

export default async function getCompany(): Promise<Company> {
    const response = await apiClient.get(`company`);

    const company: Company | undefined = response?.data;
    if (typeof company?.company_name !== 'string') throw new Error('Failed to fetch company: unexpected response shape');

    return company;
}
