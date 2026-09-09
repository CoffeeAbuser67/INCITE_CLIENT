import React from 'react';
import { Card, AspectRatio, Text, Heading, Flex, Box } from '@radix-ui/themes';
import { Link } from 'react-router-dom';
import { PublicPostListItem } from './blogTypes';
import { FALLBACK_POST_IMG } from '../../assets/constants';

import { formatarDataLonga } from '../../utils/formatters';



interface PostCardProps {
    post: PublicPostListItem;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
    return (
        <Link to={`/blog/${post.slug}`} className="no-underline text-current hover:text-current h-full">
            <Card className="h-full transform hover:-translate-y-1 transition-transform duration-300 flex flex-col">
                <Box>
                    <AspectRatio ratio={16 / 9}>
                        <img
                            src={post.imagem_destaque || FALLBACK_POST_IMG}
                            alt={`Imagem para ${post.title}`}
                            loading="lazy"
                            className="w-full h-full object-cover rounded-md"
                        />
                    </AspectRatio>
                </Box>
                <Box p="3" className="flex-grow flex flex-col justify-between">
                    <Heading as="h3" size="4" mt="2" truncate>{post.title}</Heading>
                    {post.resumo && (
                        <Text as="p" size="2" color="gray" mt="1" className="line-clamp-3 flex-grow">
                            {post.resumo}
                        </Text>
                    )}
                    <Flex align="center" gap="2" mt="3">
                        <Text size="2" weight="bold" color="jade">{post.instituicao_nome}</Text>
                        <Text color="gray" size="2">· {formatarDataLonga(post.created_at)}</Text>
                    </Flex>
                </Box>
            </Card>
        </Link>
    );
};