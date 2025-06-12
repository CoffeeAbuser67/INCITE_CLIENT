
import React, { useCallback, useEffect, useState } from 'react';
import { Card, Heading, Text, Button, Flex, Tabs, Box, TextField, Switch, Separator, TextArea, Select, AlertDialog, Spinner } from '@radix-ui/themes';
import { PlusCircle, Pencil, Trash2, ArrowLeft } from 'lucide-react';
import PostEditorDashboard from './PostEditor';
import { GerenciadorDeAba } from './GerenciadorDeAba'
import { axiosPlain } from '../../utils/axios';
import { toast } from 'react-toastify';
import { CitySelect } from './CitySelect';





// ● 🧿⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫘⫸

// HERE Interfaces & types

// --- Tipos para cada modelo ---
export type Postagem = { id: number; title: string; content: string; created_at: string };
export type Pesquisador = { id: number; nome: string; area_atuacao: string; desligado: boolean; bolsista: boolean };
export type Pesquisa = { id: number; nome: string; info: string; ano_inicio: number; ano_fim?: number };
export type AcaoExtensionista = { id: number; nome: string; info: string; ano_inicio: number; ano_fim?: number; tipo_comunidade: string };
export type ProdutoInovacao = { id: number; nome: string; info: string; ano_inicio: number; ano_fim?: number };


export interface Instituicao {
    id: number;
    nome: string;
    cidade_id_mapa: string;
    coordenador_responsavel: string;
    email: string;
    telefone: string;
    informacoes_adicionais?: string;
    postagens: Postagem[];
    pesquisadores: Pesquisador[];
    pesquisas: Pesquisa[];
    acoes_extensionistas: AcaoExtensionista[];
    produtos: ProdutoInovacao[];
}

interface SubFormProps<T> {
    dadosIniciais?: T | null;
    onSave: (dados: Partial<T>) => void;
    onCancel: () => void;
}

interface ListPageProps {
    onSelectInstituicao: (id: number) => void;
    onShowCreateForm: () => void;
}

interface FormProps {
    initialData?: Instituicao | null;
    onSaveSuccess: () => void;
    onCancel: () => void;
}

interface DetailPageProps {
    instituicaoId: number;
    onBackToList: () => void;
}

interface PostagensTabProps {
    postagensIniciais: Postagem[];
    instituicaoId: number;
    onDataChange: () => void;
}

// ── ⋙── ── ── AUX  ── ── ── ──➤
const formatarData = (timestamp: string): string => { // (●) formatarData
    if (!timestamp) return 'Data indisponível';

    const data = new Date(timestamp);

    // Intl.DateTimeFormat é o jeito moderno e correto de formatar datas
    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    }).format(data);
};

// ── ⋙── ── ── FORMS ── ── ── ──➤

export const PesquisadorForm: React.FC<SubFormProps<Pesquisador>> = ({ dadosIniciais, onSave, onCancel }) => {// ✪ PesquisadorForm
    const [nome, setNome] = useState(dadosIniciais?.nome || '');
    const [area, setArea] = useState(dadosIniciais?.area_atuacao || '');
    const [bolsista, setBolsista] = useState(dadosIniciais?.bolsista || false);
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ nome, area_atuacao: area, bolsista });
    };

    return (
        <form onSubmit={handleSubmit}>
            <Flex direction="column" gap="3">
                <label><Text as="div" size="2" mb="1" weight="bold">Nome do Pesquisador</Text><TextField.Root value={nome} onChange={e => setNome(e.target.value)} required /></label>
                <label><Text as="div" size="2" mb="1" weight="bold">Área de Atuação</Text><TextField.Root value={area} onChange={e => setArea(e.target.value)} /></label>
                <Text as="label" size="2"><Flex gap="2" align="center"><Switch checked={bolsista} onCheckedChange={setBolsista} /> Bolsista</Flex></Text>
                <Flex gap="3" mt="4" justify="end">
                    <Button variant="soft" color="gray" type="button" onClick={onCancel}>Cancelar</Button>
                    <Button type="submit">Salvar Pesquisador</Button>
                </Flex>
            </Flex>
        </form>
    );
}; // . . . 

export const PesquisaForm: React.FC<SubFormProps<Pesquisa>> = ({ dadosIniciais, onSave, onCancel }) => {// ✪ PesquisaForm
    const [nome, setNome] = useState(dadosIniciais?.nome || '');
    const [info, setInfo] = useState(dadosIniciais?.info || '');
    const [ano, setAno] = useState(dadosIniciais?.ano_inicio || new Date().getFullYear());
    const [ano_fim, setAnoFim] = useState(dadosIniciais?.ano_fim || '');


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ nome, info, ano_inicio: ano, ano_fim: ano_fim ? Number(ano_fim) : undefined });
    };

    return (
        <form onSubmit={handleSubmit}>
            <Flex direction="column" gap="3">
                <label><Text as="div" size="2" weight="bold">Nome da Pesquisa</Text><TextField.Root value={nome} onChange={e => setNome(e.target.value)} required /></label>
                <label><Text as="div" size="2" weight="bold">Informações</Text><TextArea value={info} onChange={e => setInfo(e.target.value)} /></label>
                <label><Text as="div" size="2" weight="bold">Ano de Início</Text><TextField.Root type="number" value={ano} onChange={e => setAno(Number(e.target.value))} /></label>

                <label className="flex-1">
                    <Text as="div" size="2" weight="bold">Ano de Conclusão (Opcional)</Text>
                    <TextField.Root type="number" value={ano_fim} onChange={e => setAnoFim(e.target.value)} placeholder="" />
                </label>
                <Flex gap="3" mt="4" justify="end">
                    <Button variant="soft" color="gray" type="button" onClick={onCancel}>Cancelar</Button>
                    <Button type="submit">Salvar Pesquisa</Button>
                </Flex>
            </Flex>
        </form>
    );
} // . . . 
export const AcaoExtensionistaForm: React.FC<SubFormProps<AcaoExtensionista>> = ({ dadosIniciais, onSave, onCancel }) => {// ✪ AcaoExtensionistaForm
    const [nome, setNome] = useState(dadosIniciais?.nome || '');
    const [info, setInfo] = useState(dadosIniciais?.info || '');
    const [ano_inicio, setAnoInicio] = useState(dadosIniciais?.ano_inicio || new Date().getFullYear());
    const [tipo_comunidade, setTipoComunidade] = useState(dadosIniciais?.tipo_comunidade || '');
    const [ano_fim, setAnoFim] = useState(dadosIniciais?.ano_fim || '');


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ nome, info, ano_inicio, tipo_comunidade, ano_fim: ano_fim ? Number(ano_fim) : undefined });
    };

    return (
        <form onSubmit={handleSubmit}>
            <Flex direction="column" gap="3">
                <label>
                    <Text as="div" size="2" weight="bold">Nome da Ação</Text>
                    <TextField.Root value={nome} onChange={e => setNome(e.target.value)} required />
                </label>
                <label>
                    <Text as="div" size="2" weight="bold">Informações</Text>
                    <TextArea value={info} onChange={e => setInfo(e.target.value)} />
                </label>


                <label>
                    <Text as="div" size="2" weight="bold">Tipo de Comunidade Atendida</Text>
                    <Select.Root value={tipo_comunidade} onValueChange={setTipoComunidade}>
                        <Select.Trigger placeholder="Selecione..." />
                        <Select.Content>
                            <Select.Item value="TR">Tradicionais</Select.Item>
                            <Select.Item value="IN">Indígenas</Select.Item>
                            <Select.Item value="QU">Quilombolas</Select.Item>
                            <Select.Item value="AS">Assentamentos</Select.Item>
                        </Select.Content>
                    </Select.Root>
                </label>


                <label>
                    <Text as="div" size="2" weight="bold">Ano de Início</Text>
                    <TextField.Root type="number" value={ano_inicio} onChange={e => setAnoInicio(Number(e.target.value))} />
                </label>

                <label className="flex-1">
                    <Text as="div" size="2" weight="bold">Ano de Conclusão (Opcional)</Text>
                    <TextField.Root type="number" value={ano_fim} onChange={e => setAnoFim(e.target.value)} placeholder="Deixe em branco se atual" />
                </label>


                <Flex gap="3" mt="4" justify="end">
                    <Button variant="soft" color="gray" type="button" onClick={onCancel}>Cancelar</Button>
                    <Button type="submit">Salvar Ação</Button>
                </Flex>
            </Flex>
        </form>
    );

}; // . . . 

export const ProdutoInovacaoForm: React.FC<SubFormProps<ProdutoInovacao>> = ({ dadosIniciais, onSave, onCancel }) => { // ✪ ProdutoInovacaoForm
    const [nome, setNome] = useState(dadosIniciais?.nome || '');
    const [info, setInfo] = useState(dadosIniciais?.info || '');
    const [ano_inicio, setAnoInicio] = useState(dadosIniciais?.ano_inicio || new Date().getFullYear());
    const [ano_fim, setAnoFim] = useState(dadosIniciais?.ano_fim || '');


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ nome, info, ano_inicio, ano_fim: ano_fim ? Number(ano_fim) : undefined });
    };

    return (
        <form onSubmit={handleSubmit}>
            <Flex direction="column" gap="3">
                <label>
                    <Text as="div" size="2" weight="bold">Nome do Produto/Inovação</Text>
                    <TextField.Root value={nome} onChange={e => setNome(e.target.value)} required />
                </label>
                <label>
                    <Text as="div" size="2" weight="bold">Informações</Text>
                    <TextArea value={info} onChange={e => setInfo(e.target.value)} />
                </label>
                <label>
                    <Text as="div" size="2" weight="bold">Ano de Início</Text>
                    <TextField.Root type="number" value={ano_inicio} onChange={e => setAnoInicio(Number(e.target.value))} />
                </label>
                <label className="flex-1">
                    <Text as="div" size="2" weight="bold">Ano de Conclusão (Opcional)</Text>
                    <TextField.Root type="number" value={ano_fim} onChange={e => setAnoFim(e.target.value)} placeholder="" />
                </label>

                <Flex gap="3" mt="4" justify="end">
                    <Button variant="soft" color="gray" type="button" onClick={onCancel}>Cancelar</Button>
                    <Button type="submit">Salvar Produto</Button>
                </Flex>
            </Flex>
        </form>
    );
}; // ── ⋙── ── ── ── ── ── ── ──➤

const PostagensTab = ({ postagensIniciais, instituicaoId, onDataChange }: PostagensTabProps) => { // {✪} PostagensTab
    const [mode, setMode] = useState<'list' | 'editor'>('list');
    const [postAlvo, setPostAlvo] = useState<Partial<Postagem> | null>(null);


    const [postParaExcluir, setPostParaExcluir] = useState<Postagem | null>(null);


    const mostrarFormCriacao = () => {
        setPostAlvo({ title: '', content: '' });
        setMode('editor');
    };

    const mostrarFormEdicao = (post: Postagem) => {
        setPostAlvo(post);
        setMode('editor');
    };

    const handleSalvar = async (dados: { title: string, content: string }) => {
        const payload = { ...dados, instituicao: instituicaoId };

        console.log("⋙── ── ── ── ── ── ── ──➤  ")
        console.log("payload : ", payload) // [LOG] 
        console.log("⋙── ── ── ── ── ── ── ──➤  ")

        try {
            if (postAlvo && 'id' in postAlvo) {
                await axiosPlain.put(`/postagens/${postAlvo.id}/`, payload);
                toast.success('Postagem atualizada com sucesso!');
            } else {
                await axiosPlain.post('/postagens/', payload);
                toast.success('Postagem criada com sucesso!');
            }
            setMode('list');
            setPostAlvo(null);
            onDataChange(); // Pede para a página principal recarregar os dados
        } catch (err) {
            console.error("Erro ao salvar postagem:", err.response?.data || err);
            toast.error("Erro ao salvar postagem.");
        }
    };

    const handleConfirmarExclusaoPost = async () => {
        if (!postParaExcluir) return;

        try {
            await axiosPlain.delete(`/postagens/${postParaExcluir.id}/`);
            toast.success(`Postagem "${postParaExcluir.title}" excluída com sucesso!`);

            // Chama a função do pai para recarregar todos os dados da instituição
            onDataChange();
        } catch (err) {
            console.error("Erro ao excluir postagem:", err);
            toast.warn("Ocorreu um erro ao excluir a postagem.");
        } finally {
            // Fecha a modal
            setPostParaExcluir(null);
        }
    };

    if (mode === 'editor') {
        return (
            <PostEditorDashboard
                initialTitle={postAlvo?.title}
                initialContent={postAlvo?.content || ''}
                onSave={handleSalvar}
                onCancel={() => setMode('list')}
            />
        );
    }

    return (
        <div>

            <Flex justify="between" align="center" mb="4">
                <Heading size="5">Postagens do Blog</Heading>
                <Button onClick={mostrarFormCriacao}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Nova Postagem
                </Button>
            </Flex>
            <div className="grid gap-4">

                {postagensIniciais.length > 0 ? postagensIniciais.map((post: Postagem) => (
                    <Card key={post.id}>
                        <Flex justify="between" align="center">
                            <div>
                                <Text as="p" weight="bold">{post.title}</Text>
                                <Text as="p" size="2" color="gray">Criado em: {formatarData(post.created_at)}</Text>
                            </div>
                            <Flex gap="3">
                                <Button variant="soft" onClick={() => mostrarFormEdicao(post)}>
                                    <Pencil className="h-4 w-4" />
                                </Button>

                                <Button variant="soft" color="red" onClick={() => setPostParaExcluir(post)}>

                                    <Trash2 className="h-4 w-4" />
                                </Button>

                            </Flex>
                        </Flex>
                    </Card>
                )) : <Text color="gray">Nenhuma postagem encontrada.</Text>}

            </div>

            <AlertDialog.Root open={!!postParaExcluir} onOpenChange={() => setPostParaExcluir(null)}>
                <AlertDialog.Content style={{ maxWidth: 450 }}>
                    <AlertDialog.Title>Confirmar Exclusão</AlertDialog.Title>
                    <AlertDialog.Description size="2">
                        Você tem certeza que deseja excluir a postagem
                        <Text weight="bold"> "{postParaExcluir?.title}"</Text>?
                    </AlertDialog.Description>
                    <Flex gap="3" mt="4" justify="end">
                        <AlertDialog.Cancel>
                            <Button variant="soft" color="gray">Cancelar</Button>
                        </AlertDialog.Cancel>
                        <AlertDialog.Action>
                            <Button variant="solid" color="red" onClick={handleConfirmarExclusaoPost}>
                                Sim, Excluir Postagem
                            </Button>
                        </AlertDialog.Action>
                    </Flex>
                </AlertDialog.Content>
            </AlertDialog.Root>

        </div>
    );
}; // ── ⋙── ── ── ── ── ── ── ──➤

export const InstituicaoForm = ({ initialData = null, onSaveSuccess, onCancel }: FormProps) => { // ★ InstituicaoForm
    // Lógica simples de formulário com useState
    const [nome, setNome] = useState(initialData?.nome || '');
    const [cidadeId, setCidadeId] = useState(initialData?.cidade_id_mapa || '');
    const [coordenador, setCoordenador] = useState(initialData?.coordenador_responsavel || '');
    const [email, setEmail] = useState(initialData?.email || '');
    const [telefone, setTelefone] = useState(initialData?.telefone || '');
    const [infoAdicionais, setInfoAdicionais] = useState(initialData?.informacoes_adicionais || '');



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            nome,
            cidade_id_mapa: cidadeId,
            coordenador_responsavel: coordenador,
            email,
            telefone,
            informacoes_adicionais: infoAdicionais,
        };

        try {
            if (initialData) {
                // MODO EDIÇÃO: Requisição PUT para a URL do item específico
                await axiosPlain.put(`/instituicoes/${initialData.id}/`, payload);
                toast.success(`Instituição "${nome}" atualizada com sucesso!`);
            } else {
                // MODO CRIAÇÃO: Requisição POST para a URL da lista
                await axiosPlain.post('/instituicoes/', payload);
                toast.success(`Instituição "${nome}" criada com sucesso!`);
            }
            onSaveSuccess(); // Notifica o componente pai para voltar para a lista

        } catch (err) {
            console.error('Erro ao salvar instituição:', err.response?.data || err.message);
            toast.error('Ocorreu um erro ao salvar. Verifique o console.');
        }
    };



    return (
        <form onSubmit={handleSubmit}>
            <Heading size="7" mb="6">{initialData ? 'Editar Instituição' : 'Criar Nova Instituição'}</Heading>
            <Flex direction="column" gap="4">

                {/* --- CAMPOS OBRIGATÓRIOS --- */}
                <Heading size="3" color="gray" highContrast>Informações de Contato</Heading>
                <label>
                    <Text as="div" size="2" mb="1" weight="bold">Nome da Instituição</Text>
                    <TextField.Root size="3" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: Universidade Federal..." required />
                </label>

                <label>
                    <Text as="div" size="2" mb="1" weight="bold">Cidade</Text>

                    <CitySelect // (○) CitySelect
                        value={cidadeId}
                        onChange={setCidadeId}
                    />

                </label>

                <label>
                    <Text as="div" size="2" mb="1" weight="bold">Coordenador Responsável</Text>
                    <TextField.Root size="3" value={coordenador} onChange={(e) => setCoordenador(e.target.value)} placeholder="Nome completo do coordenador" required />
                </label>
                <label>
                    <Text as="div" size="2" mb="1" weight="bold">Email</Text>
                    <TextField.Root size="3" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="contato@instituicao.br" required />
                </label>
                <label>
                    <Text as="div" size="2" mb="1" weight="bold">Telefone (WhatsApp)</Text>
                    <TextField.Root size="3" value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="(XX) XXXXX-XXXX" required />
                </label>

                <Separator my="3" size="4" />

                {/* --- CAMPOS OPCIONAIS --- */}
                <Heading size="3" color="gray" highContrast>Informações Adicionais</Heading>

                <label>
                    <TextArea size="3" value={infoAdicionais} onChange={(e) => setInfoAdicionais(e.target.value)} placeholder="Qualquer informação adicional relevante sobre a instituição..." />
                </label>

                <Flex gap="3" mt="4" justify="end">
                    <Button type="button" variant="soft" color="gray" size="3" onClick={onCancel}>Cancelar</Button>
                    <Button type="submit" size="3">Salvar</Button>
                </Flex>
            </Flex>
        </form>
    );

} // ── ⋙── ── ── ── ── ── ── ──➤

export const InstituicaoListPage = ({ onSelectInstituicao, onShowCreateForm }: ListPageProps) => { // ★ InstituicaoListPage

    const [instituicoes, setInstituicoes] = useState<Instituicao[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [alvoExclusao, setAlvoExclusao] = useState<Instituicao | null>(null);


    useEffect(() => {
        const fetchInstituicoes = async () => {
            try {
                setLoading(true);
                const response = await axiosPlain.get('/instituicoes/');
                setInstituicoes(response.data);
                setError(null);
            } catch (err) {
                setError('Falha ao carregar as instituições.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchInstituicoes();
    }, []);


    const handleConfirmarExclusao = async () => {
        if (!alvoExclusao) return;

        try {
            // Faz a chamada DELETE para a API
            await axiosPlain.delete(`/instituicoes/${alvoExclusao.id}/`);

            // Atualiza a lista no frontend para remover o item deletado
            setInstituicoes(prevInstituicoes =>
                prevInstituicoes.filter(inst => inst.id !== alvoExclusao.id)
            );

            toast.success(`Instituição "${alvoExclusao.nome}" excluída com sucesso!`);
        } catch (err) {
            console.error("Erro ao excluir instituição:", err);
            toast.error("Ocorreu um erro ao excluir a instituição.");
        } finally {
            // Fecha a modal de confirmação
            setAlvoExclusao(null);
        }
    };



    if (loading) {
        return (
            <Flex align="center" justify="center" style={{ minHeight: '400px' }}>
                <Spinner size="3" />
            </Flex>
        );
    }


    if (error) return <div className="text-red-500">{error}</div>;


    return (
        <div>
            <Flex justify="between" align="center" mb="6">
                <Heading size="8">Painel de Instituições</Heading>
                <Button size="3" onClick={onShowCreateForm}>
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Adicionar Instituição
                </Button>
            </Flex>


            <div className="grid gap-6">
                {instituicoes.map(inst => (
                    <Card key={inst.id}>
                        <Flex justify="between" align="center">
                            <div>
                                <Heading as="h3" size="4">{inst.nome}</Heading>
                                <Text as="p" size="2" color="gray">{inst.cidade_id_mapa}</Text>
                            </div>
                            <Flex gap="4">
                                <Button variant="soft" onClick={() => onSelectInstituicao(inst.id)}>
                                    <Pencil className="mr-2 h-4 w-4" /> Gerenciar
                                </Button>



                                <Button variant="soft" color="red" onClick={() => setAlvoExclusao(inst)}>

                                    <Trash2 className="mr-2 h-4 w-4" /> Excluir
                                </Button>

                            </Flex>
                        </Flex>
                    </Card>
                ))}
            </div>




            <AlertDialog.Root open={!!alvoExclusao} onOpenChange={() => setAlvoExclusao(null)}>
                <AlertDialog.Content style={{ maxWidth: 450 }}>
                    <AlertDialog.Title>Confirmar Exclusão</AlertDialog.Title>
                    <AlertDialog.Description size="2">
                        Você tem certeza que deseja excluir a instituição
                        <Text weight="bold"> "{alvoExclusao?.nome}"</Text>?
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

}; // ── ⋙── ── ── ── ── ── ── ──➤

export const InstituicaoDetailPage = ({ instituicaoId, onBackToList }: DetailPageProps) => { // ★ InstituicaoDetailPage
    const [instituicao, setInstituicao] = useState<Instituicao | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    const fetchInstituicaoDetails = useCallback(async () => {
        try {
            // Não precisa setar loading aqui para o refresh ser mais suave
            const response = await axiosPlain.get(`/instituicoes/${instituicaoId}/`);
            setInstituicao(response.data);
            setError(null);
        } catch (err) {
            setError("Não foi possível carregar os detalhes da instituição.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [instituicaoId]);

    useEffect(() => {
        setLoading(true);
        fetchInstituicaoDetails();
    }, [fetchInstituicaoDetails]);


    if (loading) {
        return (
            <Flex align="center" justify="center" style={{ minHeight: '400px' }}>
                <Spinner size="3" />
            </Flex>
        );
    }


    if (error) return <div className="text-red-500">{error}</div>;
    if (!instituicao) return <div>Instituição não encontrada.</div>;


    return (
        <div>
            <Button variant="soft" onClick={onBackToList} mb="4">
                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para a Lista
            </Button>

            <Heading size="8" mb="6">{instituicao.nome}</Heading>

            <Tabs.Root defaultValue="info">
                <Tabs.List>
                    <Tabs.Trigger value="info">Informações Gerais</Tabs.Trigger>
                    <Tabs.Trigger value="postagens">Postagens</Tabs.Trigger>
                    <Tabs.Trigger value="pesquisadores">Pesquisadores</Tabs.Trigger>
                    <Tabs.Trigger value="pesquisas">Pesquisas</Tabs.Trigger>
                    <Tabs.Trigger value="acoes">Ações Extensionistas</Tabs.Trigger>
                    <Tabs.Trigger value="produtos">Produtos e Inovações</Tabs.Trigger>
                </Tabs.List>

                <Box pt="6">
                    <Tabs.Content value="info">
                        <InstituicaoForm
                            initialData={instituicao}
                            onSaveSuccess={fetchInstituicaoDetails}
                            onCancel={onBackToList}
                        />
                    </Tabs.Content>

                    <Tabs.Content value="postagens">
                        <PostagensTab
                            postagensIniciais={instituicao.postagens || []}
                            instituicaoId={instituicao.id}
                            onDataChange={fetchInstituicaoDetails}
                        />
                    </Tabs.Content>

                    <Tabs.Content value="pesquisadores">
                        <GerenciadorDeAba
                            tituloAba="Gerenciar Pesquisadores"
                            nomeItem="Pesquisador"
                            items={instituicao.pesquisadores || []}
                            endpoint="pesquisadores"
                            instituicaoId={instituicao.id}
                            onDataChange={fetchInstituicaoDetails}
                            FormularioComponent={PesquisadorForm} // Passando o form "burro"
                            renderItem={(item: Pesquisador) => (
                                <div>
                                    <Text as="p" weight="bold">{item.nome}</Text>
                                    <Text as="p" size="2" color="gray">{item.area_atuacao}</Text>
                                </div>
                            )}
                        />
                    </Tabs.Content>

                    <Tabs.Content value="pesquisas">
                        <GerenciadorDeAba
                            tituloAba="Gerenciar Pesquisas"
                            nomeItem="Pesquisa"
                            items={instituicao.pesquisas || []}
                            endpoint="pesquisas"
                            instituicaoId={instituicao.id}
                            onDataChange={fetchInstituicaoDetails}
                            FormularioComponent={PesquisaForm} // Passando o form "burro"
                            renderItem={(item: Pesquisa) => (
                                <div>
                                    <Text as="p" weight="bold">{item.nome}</Text>
                                    <Text as="p" size="2" color="gray">Início: {item.ano_inicio}</Text>
                                </div>
                            )}
                        />
                    </Tabs.Content>

                    <Tabs.Content value="acoes">
                        <GerenciadorDeAba
                            tituloAba="Gerenciar Ações Extensionistas"
                            nomeItem="Ação Extensionista"
                            items={instituicao.acoes_extensionistas || []}
                            endpoint="acoes_extensionistas"
                            instituicaoId={instituicao.id}
                            onDataChange={fetchInstituicaoDetails}
                            FormularioComponent={AcaoExtensionistaForm}
                            renderItem={(item: AcaoExtensionista) => (
                                <div>
                                    <Text as="p" weight="bold">{item.nome}</Text>
                                    <Text as="p" size="2" color="gray">Comunidade: {item.tipo_comunidade}</Text>
                                </div>
                            )}
                        />
                    </Tabs.Content>


                    <Tabs.Content value="produtos">
                        <GerenciadorDeAba
                            tituloAba="Gerenciar Produtos e Inovações"
                            nomeItem="Produto"
                            items={instituicao.produtos || []}
                            endpoint="produtos"
                            instituicaoId={instituicao.id}
                            onDataChange={fetchInstituicaoDetails}
                            FormularioComponent={ProdutoInovacaoForm}
                            renderItem={(item: ProdutoInovacao) => (
                                <div>
                                    <Text as="p" weight="bold">{item.nome}</Text>
                                    <Text as="p" size="2" color="gray">Início: {item.ano_inicio}</Text>
                                </div>
                            )}
                        />
                    </Tabs.Content>
                </Box>
            </Tabs.Root>
        </div>
    );
}; // ── ⋙── ── ── ── ── ── ── ──➤


