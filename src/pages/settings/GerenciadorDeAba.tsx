// src/GerenciadorDeAba.tsx
import React, { useState } from 'react';
import { Heading, Button, Flex, Card, Text, Dialog, Separator, AlertDialog } from '@radix-ui/themes';
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';
import { axiosPlain } from '../../utils/axios';
import { toast } from 'react-toastify'; 


interface GerenciadorProps<T extends { id: number, nome?: string }> {
    tituloAba: string;
    nomeItem: string;
    items: T[];
    renderItem: (item: T) => React.ReactNode;


    FormularioComponent: React.FC<{
        dadosIniciais?: T | null;
        onSave: (dados: Partial<T>) => void;
        onCancel: () => void;
    }>;

    endpoint: string;
    instituicaoId: number;
    onDataChange: () => void;
}


export const GerenciadorDeAba = <T extends { id: number ; nome?: string  }>({
    tituloAba,
    nomeItem,
    items,
    renderItem,
    FormularioComponent,
    endpoint,
    instituicaoId, // Adicione instituicaoId às props
    onDataChange, // Adicione onDataChange às props

}: GerenciadorProps<T>) => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [itemAlvo, setItemAlvo] = useState<T | null >(null);
    const [itemParaExcluir, setItemParaExcluir] = useState<T | null>(null);


    const abrirModalCriacao = () => {
        setItemAlvo(null);
        setIsModalOpen(true);
    };

    const abrirModalEdicao = (item: T) => {
        setItemAlvo(item);
        setIsModalOpen(true);
    };

    const handleSalvar = async (dadosDoForm: Partial<T>) => {
        const payload = { ...dadosDoForm, instituicao: instituicaoId };
        try {
            if (itemAlvo) { // Modo Edição
                await axiosPlain.put(`/${endpoint}/${itemAlvo.id}/`, payload);
                toast.success(`${nomeItem} atualizado com sucesso!`);
            } else { // Modo Criação
                await axiosPlain.post(`/${endpoint}/`, payload);
                toast.success(`Novo ${nomeItem} criado com sucesso!`);
            }
            setIsModalOpen(false); // Fecha a modal
            onDataChange();    // Chama a função para recarregar os dados da página
        } catch (err) {
            console.error(`Erro ao salvar ${nomeItem}:`, err.response?.data || err.message);

            // Tenta mostrar uma mensagem de erro mais útil vinda da API
            const errorMsg = err.response?.data ? JSON.stringify(err.response.data) : `Ocorreu um erro ao salvar ${nomeItem}.`;
            toast.error(errorMsg);
        }
    };



    const handleConfirmarExclusao = async () => {
        if (!itemParaExcluir) return;
        try {
            await axiosPlain.delete(`/${endpoint}/${itemParaExcluir.id}/`);
            toast.success(`${nomeItem} excluído com sucesso!`);
            onDataChange();
        } catch (err) {
            console.error(`Erro ao excluir ${nomeItem}:`, err);
            toast.warn(`Ocorreu um erro ao excluir o ${nomeItem}.`);
        } finally {
            setItemParaExcluir(null);
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

                                <Button variant="soft" color="red" onClick={() => setItemParaExcluir(item)}>
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
                        dadosIniciais={itemAlvo?? undefined }
                        onSave={handleSalvar}
                        onCancel={() => setIsModalOpen(false)}
                    />
                </Dialog.Content>
            </Dialog.Root>


            <AlertDialog.Root open={!!itemParaExcluir} onOpenChange={() => setItemParaExcluir(null)}>
                <AlertDialog.Content style={{ maxWidth: 450 }}>
                    <AlertDialog.Title>Confirmar Exclusão</AlertDialog.Title>

                    <AlertDialog.Description size="2">
                        Você tem certeza que deseja excluir este item?
                        {itemParaExcluir?.nome && <Text as="p" weight="bold">"{itemParaExcluir.nome}"</Text>}
                        Esta ação não pode ser desfeita.
                    </AlertDialog.Description>

                    <Flex gap="3" mt="4" justify="end">
                        <AlertDialog.Cancel>
                            <Button variant="soft" color="gray">
                                Cancelar
                            </Button>
                        </AlertDialog.Cancel>
                        <AlertDialog.Action>
                            <Button variant="solid" color="red" onClick={handleConfirmarExclusao}>
                                Sim, Excluir
                            </Button>
                        </AlertDialog.Action>
                    </Flex>
                </AlertDialog.Content>
            </AlertDialog.Root>


        </div>
    );
};