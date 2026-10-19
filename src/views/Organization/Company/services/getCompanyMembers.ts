import apiClient from "@/config/axios";
import type { CompanyMemberRow } from "../types";

export default async function getCompanyMembers(): Promise<CompanyMemberRow[]> {
    const response = await apiClient.get(`company/members`);

    const members: CompanyMemberRow[] | undefined = response?.data?.members;
    if (!Array.isArray(members)) throw new Error('Failed to fetch company members: unexpected response shape');

    return members;
}
