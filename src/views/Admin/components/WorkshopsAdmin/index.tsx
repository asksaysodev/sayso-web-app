import { useState } from 'react';
import dayjs from 'dayjs';
import { Plus } from 'lucide-react';
import { Badge } from '@/components/ds/Badge';
import { Button } from '@/components/ds/Button';
import { Card } from '@/components/ds/Card';
import { Table, TableBody, TableCell, TableHeadCell, TableHeader, TableRow } from '@/components/ds/Table';
import { useWorkshops } from './hooks/useWorkshops';
import { AdminWorkshop } from './types';
import WorkshopFormModal from './components/WorkshopFormModal';
import './styles/WorkshopsAdmin.css';

type OpenForm = { workshop?: AdminWorkshop } | null;

export default function WorkshopsAdmin() {
    const { workshops, isLoading, isError, isRetrying, refetch } = useWorkshops();
    const [openForm, setOpenForm] = useState<OpenForm>(null);

    const renderBody = () => {
        if (isLoading) return <p className='workshops-admin__state' role='status'>Loading workshops…</p>;
        if (isError) {
            return (
                <div className='workshops-admin__state' role='alert'>
                    Couldn't load workshops.
                    <Button variant='secondary' size='sm' onClick={() => refetch()} loading={isRetrying}>Try again</Button>
                </div>
            );
        }
        if (!workshops.length) {
            return <p className='workshops-admin__state'>No workshops yet. Add the next one so its emails can go out.</p>;
        }
        return (
            <Table>
                <TableHeader>
                    <TableHeadCell>Date</TableHeadCell>
                    <TableHeadCell>Title</TableHeadCell>
                    <TableHeadCell>Status</TableHeadCell>
                    <TableHeadCell aria-label='Actions' />
                </TableHeader>
                <TableBody>
                    {workshops.map(workshop => (
                        <TableRow key={workshop.id}>
                            <TableCell>{dayjs(workshop.date).format('MMM D, YYYY')}</TableCell>
                            <TableCell>{workshop.title || 'Untitled'}</TableCell>
                            <TableCell>
                                <div className='workshops-admin__badges'>
                                    <Badge tone={workshop.status === 'ready' ? 'success' : 'neutral'}>
                                        {workshop.status === 'ready' ? 'Ready' : 'Draft'}
                                    </Badge>
                                    {workshop.locked && <Badge tone='info'>Emails sent</Badge>}
                                </div>
                            </TableCell>
                            <TableCell>
                                <Button variant='secondary' size='sm' onClick={() => setOpenForm({ workshop })}>
                                    {workshop.locked ? 'View' : 'Edit'}
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        );
    };

    return (
        <Card className='workshops-admin'>
            <div className='workshops-admin__header'>
                <div>
                    <h2 className='workshops-admin__title'>Workshops</h2>
                    <p className='workshops-admin__subtitle'>The monthly workshop content used in the weekly emails.</p>
                </div>
                <Button leftIcon={<Plus size={20} />} onClick={() => setOpenForm({})}>New workshop</Button>
            </div>
            {renderBody()}
            {openForm && (
                <WorkshopFormModal workshop={openForm.workshop} existing={workshops} onClose={() => setOpenForm(null)} />
            )}
        </Card>
    );
}
