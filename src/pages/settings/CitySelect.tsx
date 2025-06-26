// src/components/CitySelect.tsx
import React from 'react';
import Select , { StylesConfig } from 'react-select';


// Importe os dados do mapa de sua localização central
import mapCity from '../../assets/BahiaCidades4.json';
import mapRegion from '../../assets/BahiaRegiao2.json';


// --- Tipagem para as opções do react-select ---
interface CityOption {
    readonly value: string; // id da cidade
    readonly label: string; // nome da cidade
}

interface GroupedCityOption {
    readonly label: string; // nome da região
    readonly options: readonly CityOption[];
}

// --- Lógica para transformar seus dados (só é executada uma vez) ---
const opcoesDeCidadeAgrupadas: readonly GroupedCityOption[] = mapRegion
    .filter(region => region.id !== 'bahia_stroke')
    .map(region => {
        const cidadesDaRegiao = mapCity[region.id] || [];
        return {
            label: region.name,
            options: cidadesDaRegiao
                .map(city => ({ value: city.id, label: city.name }))
                .sort((a, b) => a.label.localeCompare(b.label)),
        };
    })
    .sort((a, b) => a.label.localeCompare(b.label));

// --- Estilos e Formatador para os Grupos do Select ---
const groupStyles = { /* ... seu código de estilo ... */ };


const groupBadgeStyles: React.CSSProperties = {
    backgroundColor: '#EBECF0',
    borderRadius: '2em',
    color: '#172B4D',
    display: 'inline-block',
    fontSize: 12,
    fontWeight: 'normal',
    lineHeight: '1',
    minWidth: 1,
    padding: '0.16666666666667em 0.5em',
    textAlign: 'center',
    marginLeft: '8px', // Adiciona um espaço de 8px entre o nome e o badge
};



const customSelectStyles: StylesConfig<CityOption, false, GroupedCityOption> = {
    control: (baseStyles, state) => ({
        ...baseStyles,
        minHeight: '36px',
        borderColor: state.isFocused ? '#8D6E63' : '#d1d5db', // Marrom quando focado, cinza normal
        // Remove o brilho azul padrão e adiciona um anel marrom sutil
        boxShadow: state.isFocused ? '0 0 0 1px #8D6E63' : 'none',
        '&:hover': {
            borderColor: state.isFocused ? '#8D6E63' : '#a1a1aa',
        },
    }),
    // Posso customizar outras partes também, se quiser
    // option: (styles, { isFocused, isSelected }) => ({ ... }),
    // groupHeading: (styles) => ({ ... }),
};



const formatGroupLabel = (data: GroupedCityOption) => (
    <div style={groupStyles}>
        <span>{data.label}</span>
        <span style={groupBadgeStyles}>{data.options.length}</span>
    </div>
);



interface CitySelectProps {
    value: string; // Recebe o ID da cidade selecionada
    onChange: (selectedId: string) => void; // Devolve o novo ID selecionado
}


export const CitySelect: React.FC<CitySelectProps> = ({ value, onChange }) => {
    // Lógica para encontrar o objeto da cidade selecionada a partir do ID (value)
    const todasAsOpcoes = opcoesDeCidadeAgrupadas.flatMap(group => group.options);
    const valorSelecionado = todasAsOpcoes.find(option => option.value === value);

    return (
        <Select
            value={valorSelecionado}
            // Quando uma opção é selecionada, o objeto completo é retornado.
            // Nós chamamos a função onChange do pai, passando apenas o ID (value).
            onChange={(opcaoSelecionada) => onChange(opcaoSelecionada ? opcaoSelecionada.value : '')}
            options={opcoesDeCidadeAgrupadas}
            formatGroupLabel={formatGroupLabel}
            placeholder="Digite ou selecione uma cidade..."
            isClearable
            styles={customSelectStyles}
        />
    );
};