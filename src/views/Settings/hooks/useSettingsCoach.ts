import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as Sentry from "@sentry/react";
import getSalesCoachSettings from "../services/getSalesCoachSettings";
import postBufferTime from "../services/postBufferTime";
import { useToast } from "@/context/ToastContext";
import { useEffect } from "react";

export default function useSettingsCoach() {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    const {
        data: coachSettings,
        isLoading: coachSettingsIsLoading,
        isError: coachSettingsIsError,
        error: coachSettingsError
    } = useQuery({
        queryKey: ['sales-coach-settings'],
        queryFn: getSalesCoachSettings,
    })

    const { mutate: mutateBufferTime } = useMutation({
        mutationKey: ['post-buffer-time'],
        mutationFn: postBufferTime,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sales-coach-settings'] });
        },
        onError: (error) => {
            showToast('error', 'Failed to update coach settings.');
            Sentry.captureException(error);
        }
    })
    
    useEffect(()=>{
        if (coachSettingsError !== null) {
            showToast('error','Failed to load coach settings.')
            Sentry.captureException(coachSettingsError)
        }
    },[coachSettingsError])
    
    return {
        coachSettings,
        coachSettingsIsError,
        coachSettingsIsLoading,
        mutateBufferTime
    }
}