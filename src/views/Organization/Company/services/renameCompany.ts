import apiClient from "@/config/axios";
import type { Company } from "../types";

export default async function renameCompany(companyName: string): Promise<Company> {
    const response = await apiClient.patch(`company`, { company_name: companyName });
    return response.data;
}
