import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import getSignals from "../services/getSignals";
import SignalsCollapsibleList from "./SignalsCollapsibleList";
import { GetSignalResponse } from "../types";
import { useAdminStore } from "@/store/adminStore";

export default function CueSignals() {
    const setActiveSheetVersion = useAdminStore(state => state.setActiveSheetVersion)
    const setSignalSheets = useAdminStore(state => state.setSignalSheets)
    const setLiveSheetVersion = useAdminStore(state => state.setLiveSheetVersion)

    const {
        data: signals,
        isLoading: isLoadingSignals,
        error: errorSignals,
        refetch: refetchSignals,
        isRefetching: isRefetchingSignals
    } = useQuery({
        queryKey: ['cue-signals'],
        queryFn: getSignals,
    });

    const populateSignalSheets = (response: GetSignalResponse): void => {
        if (!response) return;

        const { activeVersion, versions } = response;

        if (activeVersion) {
            setLiveSheetVersion(activeVersion);
            setActiveSheetVersion(activeVersion);
        }

        if (versions) {
            setSignalSheets(versions);
        }
    }

    useEffect(() => {
        if (!signals || errorSignals) return;

        populateSignalSheets(signals);
    }, [signals, errorSignals])

    return (
        <>
            <SignalsCollapsibleList
                isLoadingSignals={isLoadingSignals}
                error={errorSignals}
                refetchSignals={refetchSignals}
                isRefetchingSignals={isRefetchingSignals}
            />
        </>
    )
}
