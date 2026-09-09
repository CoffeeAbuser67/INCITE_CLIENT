// src/pages/BlogPage.tsx
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Heading, Grid, Box, Flex, Text, Spinner, Card, AspectRatio, Select, Button } from '@radix-ui/themes';
import { axiosPlain } from '../../utils/axios';
import { PostCard } from './PostCard';
import { PublicPostListItem, InstituicaoParaFiltro, Paginated } from './blogTypes';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const BlogPage = () => {
    const [posts, setPosts] = useState<PublicPostListItem[]>([]);
    const [instituicoes, setInstituicoes] = useState<InstituicaoParaFiltro[]>([]);
    const [count, setCount] = useState(0);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [erro, setErro] = useState(false);

    const navigate = useNavigate();
    const query = useQuery();
    // A URL agora carrega o ID da instituição, não o nome.
    const instituicaoDaUrl = query.get('instituicao');
    const [filtroInstituicao, setFiltroInstituicao] = useState<string | null>(instituicaoDaUrl);

    // As instituições não mudam com o filtro — busca uma vez só.
    useEffect(() => {
        axiosPlain.get('/map-markers/')
            .then(r => setInstituicoes(r.data))
            .catch(err => console.error("Falha ao carregar instituições:", err));
    }, []);


    const fetchPosts = useCallback(async () => {
        setIsLoading(true);
        setErro(false);
        try {
            const params: Record<string, string | number> = { page };
            if (filtroInstituicao) params.instituicao = filtroInstituicao;

            const resp = await axiosPlain.get<Paginated<PublicPostListItem>>('/blog/posts/', { params });
            setPosts(resp.data.results);
            setCount(resp.data.count);
        } catch (error) {
            console.error("Falha ao carregar dados do blog:", error);
            setErro(true);
        } finally {
            setIsLoading(false);
        }
    }, [filtroInstituicao, page]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const handleFiltroChange = (value: string) => {
        const novo = value === 'all' ? null : value;
        setFiltroInstituicao(novo);
        setPage(1);
        navigate(novo ? `/blog?instituicao=${novo}` : '/blog', { replace: true });
    };

    const instituicaoSelecionada = useMemo(
        () => filtroInstituicao ? instituicoes.find(i => String(i.id) === filtroInstituicao) : null,
        [instituicoes, filtroInstituicao]
    );

    // Destaque só faz sentido na primeira página e sem filtro ativo.
    const temDestaque = page === 1 && !filtroInstituicao && posts.length > 0;
    const postDestaque = temDestaque ? posts[0] : null;
    const outrosPosts = temDestaque ? posts.slice(1) : posts;

    const totalPaginas = Math.ceil(count / 12);

    return (
        <div className="p-4 sm:p-8 max-w-7xl mx-auto">



            <Helmet>
                <title>Notícias | INCITE AF</title>
                <meta name="description" content="Notícias e publicações das instituições parceiras do INCITE Agricultura Familiar." />
            </Helmet>






            <Heading size="9" mt="4" mb="8" align="center" className="text-gray-800">Notícias</Heading>

            {isLoading ? (
                <Flex justify="center" align="center" className="h-96"><Spinner size="3" /></Flex>
            ) : erro ? (
                <Flex direction="column" align="center" gap="4" className="py-20">
                    <Text size="4" color="gray">Não foi possível carregar as publicações.</Text>
                    <Button variant="soft" onClick={fetchPosts}>Tentar novamente</Button>
                </Flex>
            ) : posts.length === 0 ? (
                <Text as="p" align="center" color="gray" size="4" className="py-20">
                    Nenhuma postagem encontrada.
                </Text>
            ) : (
                <>
                    {postDestaque && (
                        <Link to={`/blog/${postDestaque.slug}`} className="no-underline text-current">
                            <Card size="5" mb="8" className="group overflow-hidden">
                                <Flex direction={{ initial: 'column', md: 'row' }} gap="6" align="center">
                                    <Box className="w-full md:w-3/5">
                                        <AspectRatio ratio={16 / 9}>
                                            <img
                                                src={postDestaque.imagem_destaque || 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800'}
                                                alt={postDestaque.title}
                                                className="w-full h-full object-contain rounded-xl group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </AspectRatio>
                                    </Box>
                                    <Box className="w-full md:w-2/5">
                                        <Text size="2" color="jade" weight="bold" mb="2">{postDestaque.instituicao_nome}</Text>
                                        <Heading as="h2" size={{ initial: '6', md: '8' }} mt="1">{postDestaque.title}</Heading>
                                        <Text as="p" size="3" color="gray" mt="3">{postDestaque.resumo}</Text>
                                    </Box>
                                </Flex>
                            </Card>
                        </Link>
                    )}


                    <Flex align="center" justify="between" gap="4" mb="6" wrap="wrap">
                        <Flex align="center" gap="3">
                            {instituicaoSelecionada?.marcador_logo && (
                                <Link to={`/instituicao/${instituicaoSelecionada.id}`}>
                                    <img
                                        src={instituicaoSelecionada.marcador_logo}
                                        alt={`${instituicaoSelecionada.nome} logo`}
                                        className="w-10 h-10 object-contain rounded bg-white border border-gray-100"
                                    />
                                </Link>
                            )}
                            <Text size="2" color="gray">
                                {count} {count === 1 ? 'publicação' : 'publicações'}
                                {instituicaoSelecionada && ` · ${instituicaoSelecionada.nome}`}
                            </Text>
                        </Flex>

                        <Select.Root size="2" value={filtroInstituicao || 'all'} onValueChange={handleFiltroChange}>
                            <Select.Trigger variant="soft" placeholder="Filtrar por instituição" />
                            <Select.Content variant="soft" position="popper">
                                <Select.Group>
                                    <Select.Label>Instituições</Select.Label>
                                    <Select.Item value="all">Todas as Postagens</Select.Item>
                                    {instituicoes.map(inst => (
                                        <Select.Item key={inst.id} value={String(inst.id)}>
                                            <Text size="2">{inst.nome}</Text>
                                        </Select.Item>
                                    ))}
                                </Select.Group>
                            </Select.Content>
                        </Select.Root>
                    </Flex>

                    <Grid columns={{ initial: '1', sm: '2', md: '3' }} gap="6">
                        {outrosPosts.map(post => (
                            <PostCard key={post.id} post={post} />
                        ))}
                    </Grid>

                    {totalPaginas > 1 && (
                        <Flex justify="center" align="center" gap="3" mt="8">
                            <Button variant="soft" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
                                Anterior
                            </Button>
                            <Text size="2" color="gray">Página {page} de {totalPaginas}</Text>
                            <Button variant="soft" disabled={page >= totalPaginas} onClick={() => setPage(p => p + 1)}>
                                Próxima
                            </Button>
                        </Flex>
                    )}


                </>
            )}
        </div>
    );
};

export default BlogPage;