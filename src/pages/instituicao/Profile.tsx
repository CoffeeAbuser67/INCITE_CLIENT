import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heading, Box, Text, Flex, Spinner, Card, Avatar, Badge, Tabs, Button } from '@radix-ui/themes';
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



const PesquisasList = ({ pesquisas }: PesquisasListProps) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pesquisas.map((p: Pesquisa) => (
            <Card key={p.id}>
                <Heading as="h4" size="3">{p.nome}</Heading>
                <Text as="p" size="2" color="gray" mt="1">{p.info}</Text>
                <Badge color="blue" variant="soft" mt="2">
                    Início: {p.ano_inicio}{p.ano_fim ? ` - Fim: ${p.ano_fim}` : ''}
                </Badge>
            </Card>
        ))}
    </div>
);

const AcoesExtensionistasList = ({ acoes }: AcoesExtensionistasListProps) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {acoes.map((a: AcaoExtensionista) => (
            <Card key={a.id}>
                <Heading as="h4" size="3">{a.nome}</Heading>
                <Text as="p" size="2" color="gray" mt="1">{a.info}</Text>
                <Badge color="purple" variant="soft" mt="2">
                    Comunidade: {a.tipo_comunidade}
                </Badge>
            </Card>
        ))}
    </div>
);

const ProdutosList = ({ produtos }: ProdutosListProps) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {produtos.map((p: ProdutoInovacao) => (
            <Card key={p.id}>
                <Heading as="h4" size="3">{p.nome}</Heading>
                <Text as="p" size="2" color="gray" mt="1">{p.info}</Text>
            </Card>
        ))}
    </div>
);





const PesquisadoresList = ({ pesquisadores }: PesquisadoresListProps) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {pesquisadores.map(p => (
            <Card key={p.id}>
                <Flex gap="3" align="center">
                    <Avatar fallback={p.nome.charAt(0)} size="3" radius="full" />
                    <Box>
                        <Text as="div" weight="bold">{p.nome}</Text>
                        <Text as="div" size="2" color="gray">{p.area_atuacao}</Text>
                        {p.bolsista && <Badge color="green" mt="1">Bolsista</Badge>}
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

                    {/* ▼▼▼ ABAS PREENCHIDAS COM OS NOVOS COMPONENTES ▼▼▼ */}
                    <Tabs.Content value="pesquisas">
                        <PesquisasList pesquisas={instituicao.pesquisas || []} />
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