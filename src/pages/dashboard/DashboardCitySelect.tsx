
import React, { useMemo } from 'react';
import Select, { StylesConfig } from 'react-select';
import mapCityRaw from '../../assets/BahiaCidades4.json';
import mapRegionRaw from '../../assets/BahiaRegiao2.json';

// Interfaces
interface CityData {
    id: string;
    d: string;
    'data-type': string;
    name: string;
    x: number;
    y: number;
}

interface RegionData {
    id: string;
    name: string;
}

interface MapCityData {
    [key: string]: CityData[];
}

const mapCity: MapCityData = mapCityRaw;
const mapRegion: RegionData[] = mapRegionRaw;

interface CityOption {
    readonly value: string;
    readonly label: string;
}

interface GroupedCityOption {
    readonly label: string;
    readonly options: readonly CityOption[];
}

interface DashboardCitySelectProps {
    value: string; 
    onChange: (selectedId: string) => void;
}



const customSelectStyles: StylesConfig<CityOption, false, GroupedCityOption> = {
    control: (baseStyles, state) => ({
        ...baseStyles,
        minHeight: '26px', // Altura exata do Radix size="1"
        height: '26px',
        minWidth: '200px', // Levemente mais estreito
        backgroundColor: 'var(--gray-a3, rgba(0, 0, 0, 0.05))', 
        border: 'none',
        borderRadius: 'var(--radius-2, 6px)',
        boxShadow: state.isFocused ? '0 0 0 2px var(--gray-a8, rgba(0,0,0,0.2))' : 'none',
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: 'var(--gray-a4, rgba(0, 0, 0, 0.08))',
        },
    }),
    
    // Espremendo o padding interno para caber na altura de 26px
    valueContainer: (base) => ({
        ...base,
        padding: '0 8px',
    }),
    input: (base) => ({
        ...base,
        margin: '0',
        padding: '0',
    }),
    
    menuPortal: base => ({ ...base, zIndex: 9999 }), 
    
    menu: (baseStyles) => ({
        ...baseStyles,
        backgroundColor: 'var(--color-panel-solid, #ffffff)',
        borderRadius: 'var(--radius-3, 8px)',
        boxShadow: 'var(--shadow-4, 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05))',
        padding: '4px',
    }),
    option: (baseStyles, { isFocused, isSelected }) => ({
        ...baseStyles,
        backgroundColor: isSelected 
            ? 'var(--gray-12, #111)' 
            : isFocused ? 'var(--gray-a3, rgba(0, 0, 0, 0.05))' : 'transparent',
        color: isSelected ? '#fff' : 'var(--gray-12, #111)',
        cursor: 'pointer',
        borderRadius: '4px',
        padding: '4px 8px', // Menos espaçamento nas opções também
        fontSize: '12px', // Fonte size="1"
        '&:active': {
            backgroundColor: 'var(--gray-a4, rgba(0, 0, 0, 0.1))',
        },
    }),
    singleValue: (baseStyles) => ({
        ...baseStyles,
        color: 'var(--gray-12, #111)', 
        fontWeight: 500, // Menos bold para não borrar em tamanhos pequenos
        fontSize: '12px', // Fonte size="1"
    }),
    placeholder: (baseStyles) => ({
        ...baseStyles,
        color: 'var(--gray-11, #666)',
        fontSize: '12px', // Fonte size="1"
    }),
    indicatorSeparator: () => ({ 
        display: 'none'
    }), 
    dropdownIndicator: (baseStyles) => ({
        ...baseStyles,
        color: 'var(--gray-11, #666)',
        padding: '2px 6px', // Espaço reduzido na setinha
        '&:hover': {
            color: 'var(--gray-12, #111)',
        },
        '& svg': {
            width: '14px', // Setinha menor
            height: '14px'
        }
    }),
    clearIndicator: (baseStyles) => ({
        ...baseStyles,
        padding: '2px',
        '& svg': {
            width: '14px',
            height: '14px'
        }
    }),
};

// Group Label Styling
const formatGroupLabel = (data: GroupedCityOption) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px' }}>
        <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--gray-11, #666)' }}>{data.label}</span>
        <span style={{
            backgroundColor: 'var(--gray-a3, rgba(0,0,0,0.08))', 
            borderRadius: '12px', 
            color: 'var(--gray-12, #111)', 
            fontSize: '11px', 
            padding: '2px 8px', 
            fontWeight: 'bold'
        }}>
            {data.options.length}
        </span>
    </div>
);

export const DashboardCitySelect: React.FC<DashboardCitySelectProps> = ({ value, onChange }) => {
    const groupedOptions = useMemo(() => {
        // Build standard grouped options
        const regions: GroupedCityOption[] = mapRegion
            .filter(region => region.id !== 'bahia_stroke')
            .map(region => {
                const citiesInRegion = mapCity[region.id] || [];
                return {
                    label: region.name,
                    options: citiesInRegion
                        .map((city: CityData) => ({ value: city.id, label: city.name }))
                        .sort((a, b) => a.label.localeCompare(b.label)),
                };
            })
            .sort((a, b) => a.label.localeCompare(b.label));

        // Inject Bahia (Reset option) as the first independent group
        const stateGroup: GroupedCityOption = {
            label: "Visão Geral",
            options: [{ value: "bahia", label: "Bahia" }]
        };

        return [stateGroup, ...regions];
    }, []);

    const allOptions = groupedOptions.flatMap(group => group.options);
    const selectedOption = allOptions.find(option => option.value === value) || null;

    return (
        <Select
            value={selectedOption}
            onChange={(selected) => {
                if (selected) onChange(selected.value);
            }}
            options={groupedOptions}
            formatGroupLabel={formatGroupLabel}
            placeholder="Buscar município..."
            isSearchable
            styles={customSelectStyles}
            // O PULO DO GATO PARA O Z-INDEX
            menuPortalTarget={document.body}
            menuPosition={'fixed'}
        />
    );
};