// src/GerenciadorDeAba.tsx
import React, { useState } from 'react';
import { Heading, Button, Flex, Card, Text, Dialog, Separator } from '@radix-ui/themes';
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';
import { axiosPlain } from '../../utils/axios';

// Props que o nosso gerenciador vai aceitar
interface GerenciadorProps<T extends { id: number }> {
    tituloAba: string;
    nomeItem: string;
    items: T[];
    // Função que diz como renderizar um item na lista
    renderItem: (item: T) => React.ReactNode;
    // O componente de formulário para criar/editar
    FormularioComponent: React.FC<{
        dadosIniciais?: T;
        onSave: (dados: Partial<T>) => void;
        onCancel: () => void;
    }>;
    endpoint: string; // Ex: 'pesquisadores', 'pesquisas'
}


export const GerenciadorDeAba = <T extends { id: number }>({
    tituloAba,
    nomeItem,
    items,
    renderItem,
    FormularioComponent,
    endpoint,
}: GerenciadorProps<T>) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [itemAlvo, setItemAlvo] = useState<T | null>(null);

    const abrirModalCriacao = () => {
        setItemAlvo(null);
        setIsModalOpen(true);
    };

    const abrirModalEdicao = (item: T) => {
        setItemAlvo(item);
        setIsModalOpen(true);
    };

    const handleSalvar = async (dados: Partial<T>) => {

        try {
            if (itemAlvo) { // Modo Edição
                await axiosPlain.put(`/${endpoint}/${itemAlvo.id}/`, dados);
                alert(`${nomeItem} atualizado com sucesso!`);
            } else { // Modo Criação
                await axiosPlain.post(`/${endpoint}/`, dados);
                alert(`Novo ${nomeItem} criado com sucesso!`);
            }
            setIsModalOpen(false);
            // Aqui, o ideal é chamar uma função para recarregar os dados da página
            // que será passada como prop, como `onSaveSuccess()`.
        } catch (err) {
            console.error(`Erro ao salvar ${nomeItem}:`, err.response?.data || err.message);
            alert(`Ocorreu um erro ao salvar ${nomeItem}.`);
        }

    };


    return (
        <div>
            <Flex justify="between" align="center" mb="4">
                <Heading size="5">{tituloAba}</Heading>
                <Button onClick={abrirModalCriacao}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Adicionar {nomeItem}
                </Button>
            </Flex>

            <div className="grid gap-4">
                {items.length > 0 ? items.map(item => (
                    <Card key={item.id}>
                        <Flex justify="between" align="center">
                            {renderItem(item)}
                            <Flex gap="3">
                                <Button variant="soft" onClick={() => abrirModalEdicao(item)}>
                                    <Pencil className="h-4 w-4" />
                                </Button>
                                <Button variant="soft" color="red" onClick={() => alert(`Excluir ${nomeItem} ${item.id}`)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </Flex>
                        </Flex>
                    </Card>
                )) : <Text color="gray">Nenhum(a) {nomeItem.toLowerCase()} encontrado(a).</Text>}
            </div>

            <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
                <Dialog.Content>
                    <Dialog.Title>{itemAlvo ? 'Editar' : 'Adicionar'} {nomeItem}</Dialog.Title>
                    <Separator my="3" size="4" />
                    <FormularioComponent
                        dadosIniciais={itemAlvo}
                        onSave={handleSalvar}
                        onCancel={() => setIsModalOpen(false)}
                    />
                </Dialog.Content>
            </Dialog.Root>
        </div>
    );
};