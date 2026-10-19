import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ds/Button';
import { Card } from '@/components/ds/Card';
import SearchBar from '@/components/ui/search-bar';
import useTeams from '@/views/Organization/shared/hooks/useTeams';
import filterTeams from '../utils/filterTeams';
import AddTeamModal from './AddTeamModal';
import TeamsEmptyState from './TeamsEmptyState';
import TeamsTable from './TeamsTable';
import '@/views/Organization/shared/styles/orgCard.css';

export default function TeamsCard() {
    const { teams, isLoading, isError, isRetrying, retry } = useTeams();
    const [searchText, setSearchText] = useState('');
    const [isAddTeamOpen, setIsAddTeamOpen] = useState(false);

    const filteredTeams = useMemo(() => filterTeams(teams, searchText), [teams, searchText]);
    const isEmpty = !isLoading && !isError && teams.length === 0;
    const openAddTeam = () => setIsAddTeamOpen(true);

    return (
        <Card className='org-card'>
            {isEmpty ? (
                <>
                    <h2 className='org-card__title'>Teams</h2>
                    <TeamsEmptyState onAddTeam={openAddTeam} />
                </>
            ) : (
                <>
                    <div className='org-card__header'>
                        <h2 className='org-card__title'>Teams</h2>
                        <div className='org-card__controls'>
                            <div className='org-card__search'>
                                <SearchBar
                                    searchText={searchText}
                                    onSearchTextChange={setSearchText}
                                    placeholder='Search teams…'
                                />
                            </div>
                            <Button leftIcon={<Plus size={20} />} onClick={openAddTeam}>
                                Add team
                            </Button>
                        </div>
                    </div>
                    <TeamsTable
                        teams={filteredTeams}
                        isLoading={isLoading}
                        isError={isError}
                        isRetrying={isRetrying}
                        onRetry={retry}
                        isFiltered={searchText.trim() !== ''}
                    />
                </>
            )}
            {isAddTeamOpen && <AddTeamModal onClose={() => setIsAddTeamOpen(false)} />}
        </Card>
    );
}
