import { useMutation } from "@tanstack/react-query";
import getStripeCancellationPageUrl from "../services/getStripeCancellationPageUrl";
import { useToast } from "@/context/ToastContext";
import * as Sentry from "@sentry/react";
import { openExternal } from "@/utils/helpers/openExternal";

export default function useStripeCancellation() {
    const { showToast } = useToast();
    
    const { mutate, isPending, isError} = useMutation({
        mutationFn: getStripeCancellationPageUrl,
        onSuccess: (data) => {
            openExternal(data.url);
        },
        onError: (error) => {
            Sentry.captureException(error);
            showToast('error', 'Error getting stripe cancellation page url');
        }
    })

    return {
        mutateGetStripeCancellationPageUrl: mutate,
        isPendingGetStripeCancellationPageUrl: isPending,
        isErrorGetStripeCancellationPageUrl: isError
    }
}