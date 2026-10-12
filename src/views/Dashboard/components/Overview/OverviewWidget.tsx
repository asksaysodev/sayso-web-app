import { Target } from 'lucide-react';
import WidgetCard from '../widget/WidgetCard';

export default function OverviewWidget() {
    return <WidgetCard icon={<Target size={20} />} tone='primary' title='Overview' />;
}
