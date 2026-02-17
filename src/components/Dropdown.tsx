import { useState, useEffect, Fragment } from 'react';
import { IoChevronDown, IoChevronUp } from 'react-icons/io5';
import { SlMagnifier } from 'react-icons/sl';

/**
 * Reusable dropdown component with search functionality
 * 
 * Items should have this shape (or use transformers):
 * { id, label, description?, initials? }
 * 
 * @param {Object} props
 * @param {any} props.value - Currently selected item
 * @param {Array} props.items - Array of items to display
 * @param {Function} props.onChange - Callback when item is selected (receives full item)
 * @param {boolean} props.isOpen - Whether dropdown is open
 * @param {Function} props.setIsOpen - Function to control dropdown open state
 * @param {string} props.placeholder - Placeholder text when nothing selected
 * @param {boolean} props.disabled - Whether dropdown is disabled
 * @param {boolean} props.searchable - Whether to show search input
 * @param {string} props.searchPlaceholder - Placeholder for search input
 * @param {Function} props.getLabel - Transform item to label string
 * @param {Function} props.getDescription - Transform item to description string
 * @param {Function} props.getInitials - Transform item to initials string
 * @param {Array<string>} props.searchKeys - Keys to search in (e.g. ['name', 'email'])
 * @param {boolean} props.isLoading - Loading state
 * @param {string} props.error - Error message
 * @param {string} props.emptyMessage - Message when no items found
 */

interface Props {
    value: any;
    items: any[];
    onChange: (item: any) => void;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    placeholder?: string;
    disabled?: boolean;
    searchable?: boolean;
    searchPlaceholder?: string;
    getLabel?: (item: any) => string;
    getDescription?: (item: any) => string;
    getInitials?: (item: any) => string;
    searchKeys?: string[];
    isLoading?: boolean;
    error?: string | null;
    emptyMessage?: string;
}
export default function Dropdown({
    value,
    items = [],
    onChange,
    isOpen,
    setIsOpen,
    placeholder = 'Select an option',
    disabled = false,
    searchable = false,
    searchPlaceholder = 'Search...',
    getLabel = (item) => item.label || item.name || '',
    getDescription = (item) => item.description || '',
    getInitials = (item) => item.initials || item.label?.[0] || item.name?.[0] || '?',
    searchKeys = ['label', 'name', 'description'],
    isLoading = false,
    error = null,
    emptyMessage = 'No items found'
}: Props) {
    const [searchInput, setSearchInput] = useState('');
    const [displayedItems, setDisplayedItems] = useState(items);

    useEffect(() => {
        if (!searchInput) {
            setDisplayedItems(items);
            return;
        }
        
        const lowerSearch = searchInput.toLowerCase();
        const filtered = items.filter(item => {
            return searchKeys.some(key => {
                const value = item[key];
                return value && String(value).toLowerCase().includes(lowerSearch);
            });
        });
        
        setDisplayedItems(filtered);
    }, [items, searchInput, searchKeys]);

    const handleToggle = () => {
        if (!disabled) {
            setIsOpen(!isOpen);
            if (isOpen) {
                setSearchInput('');
            }
        }
    };

    const handleSelect = (item: any) => {
        onChange(item);
        setIsOpen(false);
        setSearchInput('');
    };

    return (
        <>
            {value ? (
                <button
                    className={`coach-window-selected-prospect-button ${disabled ? 'disabled' : ''}`}
                    onClick={handleToggle}
                    data-open={isOpen}
                    disabled={disabled}
                >
                    <div className={`coach-window-select-prospect-button-text`}>
                        <div className={`coach-window-selected-prospect-initials-container ${disabled ? 'disabled' : ''}`}>
                            <p>{getInitials(value)}</p>
                        </div>
                        <div className={`coach-window-selected-prospect-button-text-container ${disabled ? 'disabled' : ''}`}>
                            <p>{getLabel(value)}</p>
                            {!disabled && (
                                <>{isOpen ? <IoChevronUp /> : <IoChevronDown />}</>
                            )}
                        </div>
                    </div>
                </button>
            ) : (
                <button
                    className='coach-window-select-prospect-button'
                    onClick={handleToggle}
                    data-open={isOpen}
                    disabled={disabled}
                >
                    <div className='coach-window-select-prospect-button-text'>
                        <p>{placeholder}</p>
                        <>{isOpen ? <IoChevronUp /> : <IoChevronDown />}</>
                    </div>
                </button>
            )}

            {/* Dropdown Modal */}
            {isOpen && (
                <div className='coach-window-select-prospect-modal' data-open={isOpen}>
                    <div className='coach-window-select-prospect-modal-content'>
                        {searchable && (
                            <div className='searchbar-container'>
                                <SlMagnifier />
                                <input
                                    type="text"
                                    placeholder={searchPlaceholder}
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                />
                            </div>
                        )}

                        {isLoading ? (
                            <p className='no-prospects-found-text'>Loading...</p>
                        ) : error ? (
                            <p className='no-prospects-found-text'>Error: {error}</p>
                        ) : searchInput !== '' && displayedItems.length === 0 ? (
                            <p className='no-prospects-found-text'>{emptyMessage}</p>
                        ) : (
                            <ul>
                                {displayedItems.map((item, index) => {
                                    const itemId = item.id ?? index;
                                    const description = getDescription(item);
                                    
                                    return (
                                        <Fragment key={itemId}>
                                            <li onClick={() => handleSelect(item)}>
                                                <div className='prospect-initials-container'>
                                                    <p>{getInitials(item)}</p>
                                                </div>
                                                <div className='prospect-info-container'>
                                                    <h4>{getLabel(item)}</h4>
                                                    {description && <p>{description}</p>}
                                                </div>
                                            </li>
                                            {index !== displayedItems.length - 1 && (
                                                <span className='ul-divider'></span>
                                            )}
                                        </Fragment>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
