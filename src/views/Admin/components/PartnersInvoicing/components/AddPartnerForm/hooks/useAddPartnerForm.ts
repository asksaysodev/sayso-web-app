import { useState } from 'react';
import axios from 'axios';
import { useForm, useFieldArray } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPartnerWithTeams } from '../services/createPartnerWithTeams';
import reportApiError from '@/utils/reportApiError';
import type { AddPartnerFormValues } from '../types';

const DEFAULT_VALUES: AddPartnerFormValues = {
    partnerName: '',
    billingEmail: '',
    netTerms: '30',
    teams: [{ email: '', planOptionId: '' }],
};

export function useAddPartnerForm() {
    const [teamCount, setTeamCount] = useState(0);
    const [isSuccess, setIsSuccess] = useState(false);
    const queryClient = useQueryClient();

    const { control, handleSubmit, watch, formState: { errors } } = useForm<AddPartnerFormValues>({
        defaultValues: DEFAULT_VALUES,
    });

    const { fields, append, remove } = useFieldArray({ control, name: 'teams' });

    const watchedTeams = watch('teams');
    const watchedNetTerms = watch('netTerms');

    const { mutate, isPending, error } = useMutation({
        mutationFn: (data: AddPartnerFormValues) => createPartnerWithTeams(data),
        onSuccess: ({ teamsInvited }) => {
            queryClient.invalidateQueries({ queryKey: ['admin-partners'] });
            setTeamCount(teamsInvited);
            setIsSuccess(true);
        },
        onError: (err) => {
            reportApiError(err, { feature: 'admin-partners', operation: 'createPartnerWithTeams' });
        },
    });

    const errorMessage = error
        ? (axios.isAxiosError(error) ? (error.response?.data?.error ?? error.message) : 'Failed to create partner')
        : null;

    return {
        control,
        onSubmit: handleSubmit((data) => mutate(data)),
        errors,
        fields,
        append: () => append({ email: '', planOptionId: '' }),
        remove,
        watchedTeams,
        watchedNetTerms,
        isPending,
        isSuccess,
        teamCount,
        errorMessage,
    };
}
