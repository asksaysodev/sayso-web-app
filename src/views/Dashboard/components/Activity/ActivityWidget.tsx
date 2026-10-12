import { ChartColumn } from 'lucide-react';
import WidgetCard from '../widget/WidgetCard';

export default function ActivityWidget() {
    return <WidgetCard icon={<ChartColumn size={20} />} tone='info' title='Activity' />;
}
