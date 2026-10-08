import { AdminPlaybook } from '../types';

export default function playbookDisplayName(playbook: AdminPlaybook): string {
    return playbook.alias?.trim() || playbook.fileName;
}
