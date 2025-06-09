
import React, { useCallback, useEffect, useState } from 'react';
import { Card, Heading, Text, Button, Flex, Tabs, Box, TextField, Switch, Separator, TextArea, Select } from '@radix-ui/themes';
import { PlusCircle, Pencil, Trash2, ArrowLeft } from 'lucide-react';
import { Instituicao, Pesquisador, Pesquisa, AcaoExtensionista, ProdutoInovacao } from './mockData';
import PostEditorDashboard from './PostEditor';
import { GerenciadorDeAba } from './GerenciadorDeAba'
import { axiosPlain } from '../../utils/axios';

// HERE Interfaces & types

type Postagem = Instituicao['postagens'][0];

interface PostagensTabProps {
    postagensIniciais: Postagem[];
    instituicaoId: number;
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
} // ── ⋙── ── ── ── ── ── ── ──➤


const PesquisadorForm = ({ dadosIniciais, onSave, onCancel, instituicaoId, onSaveSuccess }) => {
    const [nome, setNome] = useState(dadosIniciais?.nome || '');
    const [area, setArea] = useState(dadosIniciais?.area_atuacao || '');
    const [bolsista, setBolsista] = useState(dadosIniciais?.bolsista || false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            nome,
            area_atuacao: area,
            bolsista,
            instituicao: instituicaoId, // <-- Adicionamos a FK da instituição!
        };
        // A lógica de `onSave` agora será a chamada de API
        try {
            if (dadosIniciais) {
                await axiosPlain.put(`/pesquisadores/${dadosIniciais.id}/`, payload);
            } else {
                await axiosPlain.post('/pesquisadores/', payload);
            }
            alert('Pesquisador salvo com sucesso!');
            onSaveSuccess(); // Chama a função para recarregar a página
            onCancel(); // Fecha a modal
        } catch (err) {
            alert('Erro ao salvar pesquisador.');
            console.error(err);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Flex direction="column" gap="3">
                <label><Text as="div" size="2" weight="bold">Nome</Text><TextField.Root value={nome} onChange={e => setNome(e.target.value)} required /></label>
                <label><Text as="div" size="2" weight="bold">Área de Atuação</Text><TextField.Root value={area} onChange={e => setArea(e.target.value)} /></label>
                <Text as="label" size="2"><Flex gap="2" align="center"><Switch checked={bolsista} onCheckedChange={setBolsista} /> Bolsista</Flex></Text>
                <Flex gap="3" mt="4" justify="end">
                    <Button variant="soft" color="gray" type="button" onClick={onCancel}>Cancelar</Button>
                    <Button type="submit">Salvar</Button>
                </Flex>
            </Flex>
        </form>
    );
};

const PesquisaForm = ({ dadosIniciais, onSave, onCancel }) => {
    const [nome, setNome] = useState(dadosIniciais?.nome || '');
    const [info, setInfo] = useState(dadosIniciais?.info || '');
    const [ano, setAno] = useState(dadosIniciais?.ano_inicio || new Date().getFullYear());

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ nome, info, ano_inicio: ano });
    }

    return (
        <form onSubmit={handleSubmit}>
            <Flex direction="column" gap="3">
                <label><Text as="div" size="2" weight="bold">Nome da Pesquisa</Text><TextField.Root value={nome} onChange={e => setNome(e.target.value)} required /></label>
                <label><Text as="div" size="2" weight="bold">Informações</Text><TextField.Root value={info} onChange={e => setInfo(e.target.value)} /></label>
                <label><Text as="div" size="2" weight="bold">Ano de Início</Text><TextField.Root type="number" value={ano} onChange={e => setAno(Number(e.target.value))} /></label>
                <Flex gap="3" mt="4" justify="end">
                    <Button variant="soft" color="gray" type="button" onClick={onCancel}>Cancelar</Button>
                    <Button type="submit">Salvar</Button>
                </Flex>
            </Flex>
        </form>
    );
}

const AcaoExtensionistaForm = ({ dadosIniciais, onSave, onCancel }) => {
    const [nome, setNome] = useState(dadosIniciais?.nome || '');
    const [info, setInfo] = useState(dadosIniciais?.info || '');
    const [ano_inicio, setAnoInicio] = useState(dadosIniciais?.ano_inicio || new Date().getFullYear());
    const [tipo_comunidade, setTipoComunidade] = useState(dadosIniciais?.tipo_comunidade || '');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ nome, info, ano_inicio, tipo_comunidade });
    };

    return (
        <form onSubmit={handleSubmit}>
            <Flex direction="column" gap="3">
                <label><Text as="div" size="2" weight="bold">Nome da Ação</Text><TextField.Root value={nome} onChange={e => setNome(e.target.value)} required /></label>
                <label><Text as="div" size="2" weight="bold">Informações</Text><TextArea value={info} onChange={e => setInfo(e.target.value)} /></label>
                <label><Text as="div" size="2" weight="bold">Ano de Início</Text><TextField.Root type="number" value={ano_inicio} onChange={e => setAnoInicio(Number(e.target.value))} /></label>
                <label><Text as="div" size="2" weight="bold">Tipo de Comunidade</Text>
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
                <Flex gap="3" mt="4" justify="end">
                    <Button variant="soft" color="gray" type="button" onClick={onCancel}>Cancelar</Button>
                    <Button type="submit">Salvar Ação</Button>
                </Flex>
            </Flex>
        </form>
    );
};

const ProdutoInovacaoForm = ({ dadosIniciais, onSave, onCancel }) => {
    const [nome, setNome] = useState(dadosIniciais?.nome || '');
    const [info, setInfo] = useState(dadosIniciais?.info || '');
    const [ano_inicio, setAnoInicio] = useState(dadosIniciais?.ano_inicio || new Date().getFullYear());

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ nome, info, ano_inicio });
    };

    return (
        <form onSubmit={handleSubmit}>
            <Flex direction="column" gap="3">
                <label><Text as="div" size="2" weight="bold">Nome do Produto/Inovação</Text><TextField.Root value={nome} onChange={e => setNome(e.target.value)} required /></label>
                <label><Text as="div" size="2" weight="bold">Informações</Text><TextArea value={info} onChange={e => setInfo(e.target.value)} /></label>
                <label><Text as="div" size="2" weight="bold">Ano de Início</Text><TextField.Root type="number" value={ano_inicio} onChange={e => setAnoInicio(Number(e.target.value))} /></label>
                <Flex gap="3" mt="4" justify="end">
                    <Button variant="soft" color="gray" type="button" onClick={onCancel}>Cancelar</Button>
                    <Button type="submit">Salvar Produto</Button>
                </Flex>
            </Flex>
        </form>
    );
};

const PostagensTab = ({ postagensIniciais, instituicaoId, onDataChange }) => { // ✪ PostagensTab
    const [mode, setMode] = useState<'list' | 'editor'>('list');
    const [postAlvo, setPostAlvo] = useState<Partial<Postagem> | null>(null);

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
                alert('Postagem atualizada com sucesso!');
            } else {
                await axiosPlain.post('/postagens/', payload);
                alert('Postagem criada com sucesso!');
            }
            setMode('list');
            setPostAlvo(null);
            onDataChange(); // Pede para a página principal recarregar os dados
        } catch (err) {
            console.error("Erro ao salvar postagem:", err.response?.data || err);
            alert("Erro ao salvar postagem.");
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
                {postagensIniciais.length > 0 ? postagensIniciais.map(post => (
                    <Card key={post.id}>
                        <Flex justify="between" align="center">
                            <div>
                                <Text as="p" weight="bold">{post.title}</Text>
                                <Text as="p" size="2" color="gray">Criado em: {post.createdAt}</Text>
                            </div>
                            <Flex gap="3">
                                <Button variant="soft" onClick={() => mostrarFormEdicao(post)}>
                                    <Pencil className="h-4 w-4" />
                                </Button>
                                <Button variant="soft" color="red" onClick={() => alert(`Excluir post ${post.id}`)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </Flex>
                        </Flex>
                    </Card>
                )) : <Text color="gray">Nenhuma postagem encontrada.</Text>}
            </div>
        </div>
    );
}; // ── ⋙── ── ── ── ── ── ── ──➤


export const InstituicaoForm = ({ initialData = null, onSaveSuccess, onCancel }: FormProps) => {
    // Lógica simples de formulário com useState
    const [nome, setNome] = useState(initialData?.nome || '');
    const [cidade, setCidade] = useState(initialData?.cidade || '');
    const [coordenador, setCoordenador] = useState(initialData?.coordenador_responsavel || '');
    const [email, setEmail] = useState(initialData?.email || '');
    const [telefone, setTelefone] = useState(initialData?.telefone || '');
    const [infoAdicionais, setInfoAdicionais] = useState(initialData?.informacoes_adicionais || '');



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            nome,
            cidade,
            coordenador_responsavel: coordenador,
            email,
            telefone,
            informacoes_adicionais: infoAdicionais,
        };

        try {
            if (initialData) {
                // MODO EDIÇÃO: Requisição PUT para a URL do item específico
                await axiosPlain.put(`/instituicoes/${initialData.id}/`, payload);
                alert(`Instituição "${nome}" atualizada com sucesso!`);
            } else {
                // MODO CRIAÇÃO: Requisição POST para a URL da lista
                await axiosPlain.post('/instituicoes/', payload);
                alert(`Instituição "${nome}" criada com sucesso!`);
            }
            onSaveSuccess(); // Notifica o componente pai para voltar para a lista

        } catch (err) {
            console.error('Erro ao salvar instituição:', err.response?.data || err.message);
            alert('Ocorreu um erro ao salvar. Verifique o console.');
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
                    <TextField.Root size="3" value={cidade} onChange={(e) => setCidade(e.target.value)} placeholder="Ex: Itabuna" required />
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

}

export const InstituicaoListPage = ({ onSelectInstituicao, onShowCreateForm }: ListPageProps) => {

    const [instituicoes, setInstituicoes] = useState<Instituicao[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


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


    if (loading) return <div>Carregando...</div>;
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
                                <Text as="p" size="2" color="gray">{inst.cidade}</Text>
                            </div>
                            <Flex gap="4">
                                <Button variant="soft" onClick={() => onSelectInstituicao(inst.id)}>
                                    <Pencil className="mr-2 h-4 w-4" /> Gerenciar
                                </Button>
                                <Button variant="soft" color="red" onClick={() => alert(`Excluir instituição ${inst.id}`)}>
                                    <Trash2 className="mr-2 h-4 w-4" /> Excluir
                                </Button>
                            </Flex>
                        </Flex>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export const InstituicaoDetailPage = ({ instituicaoId, onBackToList }: DetailPageProps) => {
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


    if (loading) return <div>Carregando detalhes...</div>;
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
                            onSaveSuccess={fetchInstituicaoDetails} // Recarrega os dados ao salvar
                            onCancel={() => { }}
                        />
                    </Tabs.Content>

                    <Tabs.Content value="postagens">
                        <PostagensTab
                            postagensIniciais={instituicao.postagens || []}
                            instituicaoId={instituicao.id}
                            onDataChange={fetchInstituicaoDetails} // Passa a função de recarregar
                        />
                    </Tabs.Content>

                    <Tabs.Content value="pesquisadores">
                        <GerenciadorDeAba
                            tituloAba="Gerenciar Pesquisadores"
                            nomeItem="Pesquisador"
                            items={instituicao.pesquisadores || []}
                            endpoint="pesquisadores" // Endpoint da API
                            instituicaoId={instituicao.id}
                            onDataChange={fetchInstituicaoDetails} // Função para recarregar
                            FormularioComponent={PesquisadorForm}
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
                            FormularioComponent={PesquisaForm} // Corrigido para usar PesquisaForm
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


};


