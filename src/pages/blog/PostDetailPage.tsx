// src/pages/PostDetailPage.tsx
import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heading, Box, Text, Flex, Spinner, AspectRatio, Button, Card, Separator } from '@radix-ui/themes';
import { axiosPlain } from '../../utils/axios';
import axios from 'axios';
import { PublicPostDetail } from './blogTypes';
import { ArrowLeft, FileText, Download } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

import { formatarDataLonga } from '../../utils/formatters';

export const PostDetailPage = () => {
    // A rota agora usa slug em vez de id.
    const { slug } = useParams<{ slug: string }>();
    const [post, setPost] = useState<PublicPostDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [erro, setErro] = useState(false);

    const fetchPost = useCallback(async () => {
        setIsLoading(true);
        setNotFound(false);
        setErro(false);
        try {
            const response = await axiosPlain.get<PublicPostDetail>(`/blog/posts/${slug}/`);
            setPost(response.data);
        } catch (error: unknown) {
            console.error("Falha ao carregar o post:", error);
            // 404 é post inexistente; o resto é falha de carregamento.
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                setNotFound(true);
            } else {
                setErro(true);
            }
        } finally {
            setIsLoading(false);
        }
    }, [slug]);

    useEffect(() => {
        fetchPost();
    }, [fetchPost]);

    if (isLoading) {
        return <Flex justify="center" align="center" className="h-96"><Spinner size="3" /></Flex>;
    }


    if (erro) {
        return (
            <Flex direction="column" align="center" gap="4" className="p-16">
                <Text size="4" color="gray">Não foi possível carregar esta publicação.</Text>
                <Button variant="soft" onClick={fetchPost}>Tentar novamente</Button>
            </Flex>
        );
    }



    if (notFound || !post) {
        return (
            <Flex direction="column" align="center" gap="4" className="p-16">
                <Text size="4" color="gray">Post não encontrado.</Text>
                <Button variant="soft" asChild>
                    <Link to="/postagens"><ArrowLeft className="mr-2 h-4 w-4" /> Voltar para as postagens</Link>
                </Button>
            </Flex>
        );
    }

    return (

        <>


            <Helmet>
                <title>{post.title} | INCITE AF</title>
                <meta name="description" content={post.resumo || post.title} />
                <meta property="og:type" content="article" />
                <meta property="og:title" content={post.title} />
                <meta property="og:description" content={post.resumo || post.title} />
                {post.imagem_destaque && <meta property="og:image" content={post.imagem_destaque} />}
                <meta property="article:published_time" content={post.created_at} />
                <meta name="twitter:card" content="summary_large_image" />
            </Helmet>


            <article className="max-w-4xl mx-auto p-4 sm:p-8">
                <Button variant="soft" asChild mb="6">
                    <Link to="/postagens"><ArrowLeft className="mr-2 h-4 w-4" /> Voltar para as postagens</Link>
                </Button>

                <Heading as="h1" size={{ initial: '8', md: '9' }} mb="4">{post.title}</Heading>

                <Flex align="center" gap="3" mb="6" wrap="wrap">
                    <Link to={`/instituicao/${post.instituicao_id}`} className="no-underline">
                        <Text size="3" weight="bold" color="jade">{post.instituicao_nome}</Text>
                    </Link>
                    <Text color="gray">·</Text>
                    <Text size="3" color="gray">{formatarDataLonga(post.created_at)}</Text>
                    {post.autor_nome && (
                        <>
                            <Text color="gray">·</Text>
                            <Text size="3" color="gray">{post.autor_nome}</Text>
                        </>
                    )}
                </Flex>

                {post.imagem_destaque && (
                    <AspectRatio ratio={16 / 9} className="mb-8">
                        <img src={post.imagem_destaque} alt={post.title} className="w-full h-full object-cover rounded-xl shadow-lg" />
                    </AspectRatio>
                )}

                {/* HTML sanitizado no backend com bleach: sem <script>, sem
                atributo style, apenas tags de formatação e class. */}
                <Box className="prose lg:prose-xl max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />

                {post.anexos.length > 0 && (
                    <Box mt="9">
                        <Separator size="4" mb="5" />
                        <Heading size="5" mb="4">Documentos anexos</Heading>
                        <Flex direction="column" gap="3">
                            {post.anexos.map(anexo => (
                                <Card key={anexo.id} asChild>
                                    <a href={anexo.arquivo} target="_blank" rel="noopener noreferrer" className="no-underline text-current">
                                        <Flex align="center" justify="between" gap="3">
                                            <Flex align="center" gap="3" className="truncate">
                                                <FileText size={20} className="text-red-600 flex-shrink-0" />
                                                <Text size="3" className="truncate">{anexo.nome_original}</Text>
                                            </Flex>
                                            <Download size={18} className="text-gray-500 flex-shrink-0" />
                                        </Flex>
                                    </a>
                                </Card>
                            ))}
                        </Flex>
                    </Box>
                )}
            </article>

        </>




    );
};

export default PostDetailPage;