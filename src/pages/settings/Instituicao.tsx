
import React, { useState } from 'react';
import { Card, Heading, Text, Button, Flex, Tabs, Box, TextField, Switch, Separator, TextArea } from '@radix-ui/themes';
import { PlusCircle, Pencil, Trash2, ArrowLeft } from 'lucide-react';
import { instituicoesMock, Instituicao, Pesquisador, Pesquisa } from './mockData';
import PostEditorDashboard from './PostEditor';
import { GerenciadorDeAba } from './GerenciadorDeAba'

type Postagem = Instituicao['postagens'][0];

interface PostagensTabProps {
    postagensIniciais: Postagem[];
    instituicaoId: number;
}
const PostagensTab = ({ postagensIniciais, instituicaoId }: PostagensTabProps) => {
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

    const handleSalvar = (dados: { title: string, content: string }) => {
        if (postAlvo && 'id' in postAlvo) {
            console.log(`EDITANDO Post ID ${postAlvo.id} da Instituição ${instituicaoId}`, dados);
            alert(`Post "${dados.title}" atualizado! (Simulado)`);
        } else {
            console.log(`CRIANDO Novo Post para Instituição ${instituicaoId}`, dados);
            alert(`Post "${dados.title}" criado! (Simulado)`);
        }
        setMode('list');
        setPostAlvo(null);
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
};

interface ListPageProps {
    onSelectInstituicao: (id: number) => void;
    onShowCreateForm: () => void;
}

export const InstituicaoListPage = ({ onSelectInstituicao, onShowCreateForm }: ListPageProps) => {
    const instituicoes = instituicoesMock;

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

interface FormProps {
    initialData?: Instituicao | null;
    onSaveSuccess: () => void;
    onCancel: () => void;
}

export const InstituicaoForm = ({ initialData = null, onSaveSuccess, onCancel }: FormProps) => {
    // Lógica simples de formulário com useState
    const [nome, setNome] = useState(initialData?.nome || '');
    const [cidade, setCidade] = useState(initialData?.cidade || '');
    const [coordenador, setCoordenador] = useState(initialData?.coordenador_responsavel || '');
    const [email, setEmail] = useState(initialData?.email || '');
    const [telefone, setTelefone] = useState(initialData?.telefone || '');
    const [infoAdicionais, setInfoAdicionais] = useState(initialData?.informacoes_adicionais || '');


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // ▼▼▼ PAYLOAD ATUALIZADO COM TODOS OS CAMPOS ▼▼▼
        const payload = {
            nome,
            cidade,
            coordenador_responsavel: coordenador,
            email,
            telefone,
            informacoes_adicionais: infoAdicionais,
        };

        console.log('Salvando dados:', payload);
        alert(`Salvando Instituição: ${nome}`);
        onSaveSuccess(); // Notifica o componente pai para mudar a view
    }

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

export const PesquisadorForm = ({ dadosIniciais, onSave, onCancel }) => {
    const [nome, setNome] = useState(dadosIniciais?.nome || '');
    const [area, setArea] = useState(dadosIniciais?.area_atuacao || '');
    const [bolsista, setBolsista] = useState(dadosIniciais?.bolsista || false);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ nome, area_atuacao: area, bolsista });
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

export const PesquisaForm = ({ dadosIniciais, onSave, onCancel }) => {
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

interface DetailPageProps {
    instituicaoId: number;
    onBackToList: () => void;
}

export const InstituicaoDetailPage = ({ instituicaoId, onBackToList }: DetailPageProps) => {
    const instituicao = instituicoesMock.find(inst => inst.id === instituicaoId);

    if (!instituicao) { /* ...código de erro... */ }

    return (
        <div>
            {/* ... Botão de voltar e Título ... */}
            <Button variant="soft" onClick={onBackToList} mb="4"><ArrowLeft className="mr-2 h-4 w-4" /> Voltar</Button>
            <Heading size="8" mb="6">{instituicao.nome}</Heading>

            <Tabs.Root defaultValue="info">
                <Tabs.List>
                    <Tabs.Trigger value="info">Informações Gerais</Tabs.Trigger>
                    <Tabs.Trigger value="postagens">Postagens</Tabs.Trigger>
                    <Tabs.Trigger value="pesquisadores">Pesquisadores</Tabs.Trigger>
                    <Tabs.Trigger value="pesquisas">Pesquisas</Tabs.Trigger>
                    {/* Adicione triggers para Ações e Produtos aqui */}
                </Tabs.List>
                <Box pt="6">
                    <Tabs.Content value="info">
                        <InstituicaoForm initialData={instituicao} onSaveSuccess={onBackToList} onCancel={() => { }} />
                    </Tabs.Content>
                    <Tabs.Content value="postagens">
                        <PostagensTab postagensIniciais={instituicao.postagens} instituicaoId={instituicao.id} />
                    </Tabs.Content>

                    {/* ▼▼▼ USANDO O NOSSO NOVO GERENCIADOR ▼▼▼ */}
                    <Tabs.Content value="pesquisadores">
                        <GerenciadorDeAba
                            tituloAba="Gerenciar Pesquisadores"
                            nomeItem="Pesquisador"
                            items={instituicao.pesquisadores}
                            FormularioComponent={PesquisadorForm}
                            renderItem={(pesquisador) => (
                                <div>
                                    <Text as="p" weight="bold">{pesquisador.nome}</Text>
                                    <Text as="p" size="2" color="gray">{pesquisador.area_atuacao}</Text>
                                </div>
                            )}
                        />
                    </Tabs.Content>

                    <Tabs.Content value="pesquisas">
                        <GerenciadorDeAba
                            tituloAba="Gerenciar Pesquisas"
                            nomeItem="Pesquisa"
                            items={instituicao.pesquisas}
                            FormularioComponent={PesquisaForm}
                            renderItem={(pesquisa) => (
                                <div>
                                    <Text as="p" weight="bold">{pesquisa.nome}</Text>
                                    <Text as="p" size="2" color="gray">Início: {pesquisa.ano_inicio}</Text>
                                </div>
                            )}
                        />
                    </Tabs.Content>
                </Box>
            </Tabs.Root>
        </div>
    );
};