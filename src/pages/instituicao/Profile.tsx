import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heading, Box, Text, Flex, Spinner, Card, Avatar, Badge, Tabs, Button, Tooltip } from '@radix-ui/themes';
import { axiosPlain } from '../../utils/axios';
import { MapPin, Mail, Phone, Newspaper, User as UserIcon, ArrowRightIcon } from 'lucide-react';


import {
    Instituicao,
    Pesquisador,
    Pesquisa,
    AcaoExtensionista,
    ProdutoInovacao,
    Postagem
} from '../settings/Instituicao';

interface SobreTabProps {
    instituicao: Instituicao;
}
interface PesquisasListProps {
    pesquisas: Pesquisa[];
    todosPesquisadores: Pesquisador[]; // <-- Adicionado
}
interface AcoesExtensionistasListProps {
    acoes: AcaoExtensionista[];
}
interface ProdutosListProps {
    produtos: ProdutoInovacao[];
}
interface PesquisadoresListProps {
    pesquisadores: Pesquisador[];
}


const SobreTab = ({ instituicao }: SobreTabProps) => (
    <Card>
        <Heading size="4" mb="2">Sobre a Instituição</Heading>
        <Text as="p" color="gray">{instituicao.informacoes_adicionais || 'Nenhuma informação adicional fornecida.'}</Text>
    </Card>
);

const ExpandableText = ({ text }: { text: string }) => {
    const [expanded, setExpanded] = useState(false);

    if (!text) return <Text as="p" size="2" color="gray" mt="1">Sem informações adicionais.</Text>;

    return (
        <Box mt="1">
            <Text
                as="p"
                size="2"
                color="gray"
                className={expanded ? "" : "line-clamp-3"}
                style={{ transition: 'all 0.3s ease' }}
            >
                {text}
            </Text>
            {text.length > 120 && (
                <Text
                    as="span"
                    size="1"
                    color="blue"
                    className="cursor-pointer font-medium hover:underline mt-1 inline-block"
                    onClick={() => setExpanded(!expanded)}
                >
                    {expanded ? "Ler menos" : "Ler mais"}
                </Text>
            )}
        </Box>
    );
};


const formatarDataBR = (dataString?: string) => {
    if (!dataString) return '';
    // Divide a string e inverte a ordem
    const [ano, mes, dia] = dataString.split('-');
    return `${dia}/${mes}/${ano}`;
};


const PesquisasList = ({ pesquisas, todosPesquisadores }: PesquisasListProps) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pesquisas.map((p: Pesquisa) => {
            const pesquisadoresVinculados = p.pesquisadores
                ? todosPesquisadores.filter(pesq => p.pesquisadores?.includes(pesq.id))
                : [];

            return (
                <Card key={p.id} className="flex flex-col h-full">
                    <Heading as="h4" size="3">{p.nome}</Heading>

                    <Box className="flex-grow">
                        <ExpandableText text={p.info} />
                    </Box>

                    <Box mt="4" pt="3" style={{ borderTop: '1px solid var(--gray-a4)' }}>
                        {pesquisadoresVinculados.length > 0 && (
                            <Box mb="3">
                                <Text size="1" weight="bold" color="gray" mb="2" as="div">
                                    Equipe de Pesquisa:
                                </Text>
                                <Flex wrap="wrap" gap="2">
                                    {pesquisadoresVinculados.map(pv => (
                                        <Badge key={pv.id} color="gray" variant="surface" radius="large">
                                            <UserIcon size={12} className="mr-1" />
                                            {pv.nome.split(' ')[0]}
                                        </Badge>
                                    ))}
                                </Flex>
                            </Box>
                        )}

                        {/* Nova formatação do período */}
                        <Box p="2" className="bg-blue-50 rounded-md border border-blue-100">
                            <Text as="div" size="1" weight="bold" color="blue" mb="1">Período da pesquisa:</Text>
                            <Text as="div" size="2" color="blue">
                                {formatarDataBR(p.data_inicio)} {p.data_fim ? `à ${formatarDataBR(p.data_fim)}` : '- Em desenvolvimento'}
                            </Text>
                        </Box>
                    </Box>
                </Card>
            );
        })}
    </div>
);

const AcoesExtensionistasList = ({ acoes }: AcoesExtensionistasListProps) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {acoes.map((a: AcaoExtensionista) => (
            <Card key={a.id} className="flex flex-col h-full">
                <Heading as="h4" size="3">{a.nome}</Heading>

                {/* Aplicando o truncamento elegante */}
                <Box className="flex-grow">
                    <ExpandableText text={a.info} />
                </Box>

                <Box mt="4" pt="3" style={{ borderTop: '1px solid var(--gray-a4)' }}>
                    <Badge color="purple" variant="soft" mb="3">
                        Comunidade: {a.tipo_comunidade}
                    </Badge>

                    {/* Nova formatação do período */}
                    <Box p="2" className="bg-purple-50 rounded-md border border-purple-100">
                        <Text as="div" size="1" weight="bold" color="purple" mb="1">Período da ação:</Text>
                        <Text as="div" size="2" color="purple">
                            {formatarDataBR(a.data_inicio)} {a.data_fim ? `à ${formatarDataBR(a.data_fim)}` : '- Em atuação'}
                        </Text>
                    </Box>
                </Box>
            </Card>
        ))}
    </div>
);

const ProdutosList = ({ produtos }: ProdutosListProps) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {produtos.map((p: ProdutoInovacao) => (
            <Card key={p.id} className="flex flex-col h-full">
                <Heading as="h4" size="3">{p.nome}</Heading>

                {/* Aplicando o truncamento elegante */}
                <Box className="flex-grow">
                    <ExpandableText text={p.info} />
                </Box>

                <Box mt="4" pt="3" style={{ borderTop: '1px solid var(--gray-a4)' }}>
                    {/* Nova formatação do período */}
                    <Box p="2" className="bg-green-50 rounded-md border border-green-100">
                        <Text as="div" size="1" weight="bold" color="green" mb="1">Período de desenvolvimento:</Text>
                        <Text as="div" size="2" color="green">
                            {formatarDataBR(p.data_inicio)} {p.data_fim ? `à ${formatarDataBR(p.data_fim)}` : '- Em produção'}
                        </Text>
                    </Box>
                </Box>
            </Card>
        ))}
    </div>
);

const PesquisadoresList = ({ pesquisadores }: PesquisadoresListProps) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {pesquisadores.map(p => (
            <Card key={p.id} className="h-full">
                <Flex gap="3" align="center" className="h-full">
                    <Avatar fallback={p.nome.charAt(0)} size="3" radius="full" className="flex-shrink-0" />

                    <Box className="flex-1 min-w-0">
                        <Tooltip content={p.nome}>
                            <Text as="div" weight="bold" className="truncate cursor-default">
                                {p.nome}
                            </Text>
                        </Tooltip>

                        <Text as="div" size="2" color="gray" className="truncate">
                            {p.area_atuacao}
                        </Text>

                        {p.bolsista && (
                            <Box mt="1">
                                <Badge color="green">Bolsista</Badge>
                            </Box>
                        )}
                    </Box>
                </Flex>
            </Card>
        ))}
    </div>
);

const InstituicaoProfilePage = () => {
    const { id } = useParams<{ id: string }>();
    const [instituicao, setInstituicao] = useState<Instituicao | null>(null);
    const [isLoading, setIsLoading] = useState(true);



    useEffect(() => {
        const fetchInstituicao = async () => {
            setIsLoading(true);
            try {
                const response = await axiosPlain.get(`/profile/instituicoes/${id}/`);
                setInstituicao(response.data);
                console.log('%c ── ⋙⇌⇌⇌⇌ instituicao ⇌⇌⇌⇌⇌⇌⫸ 🏢', 'color: black; font-size: 16px; font-weight: bold;');
                console.log(response.data);

            } catch (error) {
                console.error("Falha ao carregar instituição:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchInstituicao();
    }, [id]);

    if (isLoading) {
        return <Flex justify="center" align="center" className="h-96"><Spinner size="3" /></Flex>;
    }

    if (!instituicao) {
        return <div className="text-center p-8">Instituição não encontrada.</div>;
    }

    return (

        <div className="max-w-5xl mx-auto p-4 sm:p-8">
            <Flex gap="5" align="center" mb="6">
                <Avatar
                    src={instituicao.marcador_logo ?? undefined}
                    fallback={instituicao.nome.charAt(0)}
                    size="8"
                    radius="full"
                />

                <Box>
                    <Heading size={{ initial: '7', md: '8' }}>{instituicao.nome}</Heading>
                    <Flex align="center" gap="4" mt="2" wrap="wrap">
                        <Flex align="center" gap="2"><MapPin size={16} /><Text size="2">{instituicao.cidade_nome.toLocaleUpperCase()}</Text></Flex>
                        <Flex align="center" gap="2"><UserIcon size={16} /><Text size="2">{instituicao.coordenador_responsavel}</Text></Flex>
                        <Flex align="center" gap="2"><Mail size={16} /><Text size="2">{instituicao.email}</Text></Flex>
                        <Flex align="center" gap="2"><Phone size={16} /><Text size="2">{instituicao.telefone}</Text></Flex>
                    </Flex>
                </Box>
            </Flex>


            <Tabs.Root defaultValue="sobre">
                <Tabs.List>
                    <Tabs.Trigger value="sobre">Sobre</Tabs.Trigger>
                    <Tabs.Trigger value="pesquisadores">Pesquisadores ({instituicao.pesquisadores.length})</Tabs.Trigger>
                    <Tabs.Trigger value="pesquisas">Pesquisas ({instituicao.pesquisas.length})</Tabs.Trigger>
                    <Tabs.Trigger value="acoes">Ações ({instituicao.acoes_extensionistas.length})</Tabs.Trigger>
                    <Tabs.Trigger value="produtos">Produtos ({instituicao.produtos.length})</Tabs.Trigger>
                    <Tabs.Trigger value="noticias">Notícias ({instituicao.postagens.length})</Tabs.Trigger>
                </Tabs.List>

                <Box pt="6">
                    <Tabs.Content value="sobre">
                        <SobreTab instituicao={instituicao} />
                    </Tabs.Content>
                    <Tabs.Content value="pesquisadores">
                        <PesquisadoresList pesquisadores={instituicao.pesquisadores || []} />
                    </Tabs.Content>

                    <Tabs.Content value="pesquisas">
                        <PesquisasList
                            pesquisas={instituicao.pesquisas || []}
                            todosPesquisadores={instituicao.pesquisadores || []}
                        />
                    </Tabs.Content>

                    <Tabs.Content value="acoes">
                        <AcoesExtensionistasList acoes={instituicao.acoes_extensionistas || []} />
                    </Tabs.Content>
                    <Tabs.Content value="produtos">
                        <ProdutosList produtos={instituicao.produtos || []} />
                    </Tabs.Content>

                    <Tabs.Content value="noticias">
                        <Flex direction="column" gap="4">
                            <Heading size="4">Notícias e Atualizações Recentes</Heading>

                            {/* Verificamos se a instituição tem postagens */}
                            {instituicao.postagens && instituicao.postagens.length > 0 ? (
                                <Flex direction="column" gap="3">
                                    {/* 1. Pegamos apenas os 3 primeiros posts e os mapeamos */}
                                    {instituicao.postagens.slice(0, 3).map((post: Postagem) => (
                                        // 2. Cada item da lista é um link para o post completo
                                        <Link to={`/blog/${post.id}`} key={post.id} className="no-underline text-current">
                                            <Card className="hover:bg-gray-50 transition-colors">
                                                <Flex align="center" gap="3">
                                                    <Newspaper size={24} className="text-gray-600 flex-shrink-0" />
                                                    <Box>
                                                        <Text as="p" weight="bold" className="text-gray-800">{post.title}</Text>
                                                        <Text as="p" size="2" color="gray">
                                                            {new Date(post.created_at).toLocaleDateString('pt-BR', { dateStyle: 'long' })}
                                                        </Text>
                                                    </Box>
                                                </Flex>
                                            </Card>
                                        </Link>
                                    ))}
                                </Flex>
                            ) : (
                                // 3. Mensagem para quando não há posts
                                <Text color="gray">Nenhuma notícia publicada por esta instituição.</Text>
                            )}

                            {/* 4. O botão "Ver mais" que leva para a página de blog filtrada */}
                            {/* Ele só aparece se houver posts para mostrar */}
                            {instituicao.postagens && instituicao.postagens.length > 0 && (
                                <Button variant="soft" asChild mt="3" className='my-4 text-black' style={{ width: 'fit-content' }}>
                                    <Link to={`/blog?instituicao=${encodeURIComponent(instituicao.nome)}`}>
                                        Ver notícias ({instituicao.postagens.length})
                                        <ArrowRightIcon className="ml-2" />
                                    </Link>
                                </Button>
                            )}
                        </Flex>
                    </Tabs.Content>
                </Box>
            </Tabs.Root>


        </div>
    );
};

export default InstituicaoProfilePage