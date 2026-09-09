// Profile.tsx
import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heading, Box, Text, Flex, Spinner, Card, Avatar, Badge, Tabs, Button, Tooltip } from '@radix-ui/themes';
import { axiosPlain } from '../../utils/axios';
import { MapPin, Mail, Phone, Newspaper, User as UserIcon, ArrowRightIcon } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

import {
    Pesquisador,
    Pesquisa,
    AcaoExtensionista,
    ProdutoInovacao,
} from '../settings/Instituicao';

import { PublicPostListItem } from '../blog/blogTypes';

import { formatarDataBR, formatarDataLonga } from '../../utils/formatters';


interface InstituicaoPublica {
    id: number;
    nome: string;
    cidade_id_mapa: string;
    cidade_nome: string;
    coordenador_responsavel: string;
    email: string;
    telefone: string;
    informacoes_adicionais?: string;
    postagens: PublicPostListItem[];
    pesquisadores: Pesquisador[];
    pesquisas: Pesquisa[];
    acoes_extensionistas: AcaoExtensionista[];
    produtos: ProdutoInovacao[];
    offset_x: number;
    offset_y: number;
    marcador_logo: string | null;
}





interface SobreTabProps {
    instituicao: InstituicaoPublica;
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
    const [instituicao, setInstituicao] = useState<InstituicaoPublica | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [erro, setErro] = useState(false);



    const fetchInstituicao = useCallback(async () => {
        setIsLoading(true);
        setErro(false);
        try {
            const response = await axiosPlain.get<InstituicaoPublica>(`/profile/instituicoes/${id}/`);
            setInstituicao(response.data);
        } catch (error) {
            console.error("Falha ao carregar instituição:", error);
            setErro(true);
        } finally {
            setIsLoading(false);
        }
    }, [id]);



    useEffect(() => {
        fetchInstituicao();
    }, [fetchInstituicao]);


    if (isLoading) {
        return <Flex justify="center" align="center" className="h-96"><Spinner size="3" /></Flex>;
    }



    if (erro) {
        return (
            <Flex direction="column" align="center" gap="4" className="p-16">
                <Text size="4" color="gray">Não foi possível carregar esta instituição.</Text>
                <Button variant="soft" onClick={fetchInstituicao}>Tentar novamente</Button>
            </Flex>
        );
    }




    if (!instituicao) {
        return <div className="text-center p-8">Instituição não encontrada.</div>;
    }

    return (

        <>
            <Helmet>
                <title>{instituicao.nome} | INCITE AF</title>
                <meta
                    name="description"
                    content={instituicao.informacoes_adicionais?.slice(0, 160) || instituicao.nome}
                />
            </Helmet>

            <div className="max-w-5xl mx-auto p-4 sm:p-8">


                <Helmet>
                    <title>{instituicao.nome} | INCITE AF</title>
                    <meta name="description" content={instituicao.informacoes_adicionais?.slice(0, 160) || instituicao.nome} />
                </Helmet>






                <Flex gap="5" align="center" mb="6">
                    <Avatar
                        src={instituicao.marcador_logo ?? undefined}
                        fallback={instituicao.nome.charAt(0)}
                        size="8"
                        radius="full"
                        loading="lazy"
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
                                <Flex align="baseline" gap="3" wrap="wrap">
                                    <Heading size="4">Notícias e Atualizações Recentes</Heading>
                                    {instituicao.postagens.length > 3 && (
                                        <Text size="2" color="gray">
                                            mostrando 3 de {instituicao.postagens.length}
                                        </Text>
                                    )}
                                </Flex>

                                {instituicao.postagens && instituicao.postagens.length > 0 ? (
                                    <Flex direction="column" gap="3">
                                        {instituicao.postagens.slice(0, 3).map((post: PublicPostListItem) => (
                                            <Link to={`/blog/${post.slug}`} key={post.id} className="no-underline text-current">
                                                <Card className="hover:bg-gray-50 transition-colors">
                                                    <Flex align="center" gap="3">
                                                        <Newspaper size={24} className="text-gray-600 flex-shrink-0" />
                                                        <Box>
                                                            <Text as="p" weight="bold" className="text-gray-800">{post.title}</Text>
                                                            <Text as="p" size="2" color="gray">
                                                                {formatarDataLonga(post.created_at)}
                                                            </Text>
                                                        </Box>
                                                    </Flex>
                                                </Card>
                                            </Link>
                                        ))}
                                    </Flex>
                                ) : (
                                    <Text color="gray">Nenhuma notícia publicada por esta instituição.</Text>
                                )}

                                {instituicao.postagens.length > 3 && (
                                    <Button variant="soft" asChild mt="3" className='my-4 text-black' style={{ width: 'fit-content' }}>
                                        <Link to={`/blog?instituicao=${instituicao.id}`}>
                                            Ver todas as notícias ({instituicao.postagens.length})
                                            <ArrowRightIcon className="ml-2" />
                                        </Link>
                                    </Button>
                                )}
                            </Flex>
                        </Tabs.Content>
                    </Box>
                </Tabs.Root>


            </div>

        </>


    );
};

export default InstituicaoProfilePage