// src/components/PostCard.tsx

import React from 'react';
import { Card, AspectRatio, Text, Heading, Flex, Box } from '@radix-ui/themes';
import { Link } from 'react-router-dom';
import { PublicPost } from './blogTypes'; // Importando nosso tipo

// Função utilitária para formatar a data
const formatarData = (timestamp: string): string => {
    if (!timestamp) return 'Data indisponível';
    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit', month: 'long', year: 'numeric'
    }).format(new Date(timestamp));
};

interface PostCardProps {
    post: PublicPost;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
    // O link envolve todo o card, tornando-o clicável
    return (
        <Link to={`/blog/${post.id}`} className="no-underline text-current hover:text-current h-full">
            <Card className="h-full transform hover:-translate-y-1 transition-transform duration-300 flex flex-col">
                <Box>
                    <AspectRatio ratio={16 / 9}>
                        <img
                            src={post.imagem_destaque || `https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800`}
                            alt={`Imagem para ${post.title}`}
                            className="w-full h-full object-cover rounded-md"
                        />
                    </AspectRatio>
                </Box>
                <Box p="3" className="flex-grow flex flex-col">
                    <Heading as="h3" size="4" mt="2" truncate>{post.title}</Heading>
                    {post.resumo && (
                        <Text as="p" size="2" color="gray" mt="1" className="line-clamp-3 flex-grow">
                            {post.resumo}
                        </Text>
                    )}
                    <Flex align="center" gap="2" mt="3">
                        <Text size="2" weight="bold" color="jade">{post.instituicao_nome || 'IN-CITE AF'}</Text>
                        <Text color="gray" size="2">· {formatarData(post.created_at)}</Text>
                    </Flex>
                </Box>
            </Card>
        </Link>
    );
};