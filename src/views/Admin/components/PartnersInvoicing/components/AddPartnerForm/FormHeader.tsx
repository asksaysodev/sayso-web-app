import { Building2, X } from 'lucide-react';
import { DialogClose, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import './styles/FormHeader.css';

export default function FormHeader() {
    return (
        <div className="form-header">
            <div className="form-header__icon-tile">
                <Building2 size={18} />
            </div>
            <div className="form-header__text">
                <DialogTitle className="form-header__title">Add Partner</DialogTitle>
                <DialogDescription className="form-header__subtitle">
                    Set up a new partner account and fund their teams.
                </DialogDescription>
            </div>
            <DialogClose className="form-header__close" aria-label="Close">
                <X size={16} />
            </DialogClose>
        </div>
    );
}
