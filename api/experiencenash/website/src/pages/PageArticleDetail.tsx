import { Select, Image, Input, Button } from 'antd';
import React, { useState } from 'react';
import styled from 'styled-components';
import { ArticleCard } from '../ArticleCard';
import { CaretRightOutlined } from '@ant-design/icons';
import { RouteComponentProps } from 'react-router-dom';
import { TEST_ARTICLE } from './PageHome';
import { useResource } from '../Resource';

export const PageArticleDetail = (
  props: RouteComponentProps<{ articleId: string; articleTitle: string }>
) => {
  const { articleId, articleTitle } = props.match.params;
  const [article] = useResource<ArticleAPI.Article>(`/articles/${articleId}`);

  console.log(`article: ${JSON.stringify(article)}`);
  console.log(`article id: ${JSON.stringify(articleId)}`);
  console.log(`article title: ${JSON.stringify(articleTitle)}`);
  if (!article) {
    return <span />;
  }
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          fontSize: 36,
          fontWeight: 'bold',
          padding: '80px 100px',
          maxWidth: 900,
          width: '100%',
        }}
      >
        {article.title}
      </div>
      {article.images && article.images.length > 0 && (
        <Image src={article.images[0]} style={{ width: 'auto', height: 400 }} />
      )}
      <p style={{ padding: '80px 100px', maxWidth: 900, width: '100%' }}>
        {article.description}
      </p>
      <div
        style={{
          display: 'flex',
          justifyContent: 'left',
          alignItems: 'center',
          padding: '20px 100px',
          maxWidth: 900,
          width: '100%',
        }}
      >
        Share:
        <SocialIcon src={require('../images/instagram@2x.png').default} />
        <SocialIcon src={require('../images/facebook@2x.png').default} />
        <SocialIcon src={require('../images/pinterest@2x.png').default} />
      </div>
      <div
        style={{
          width: '100%',
          backgroundColor: 'black',
          height: 3,
          maxWidth: 700,
          padding: '0px 100px',
        }}
      />
    </div>
  );
};

const SocialIcon = styled.img`
  padding: 0px 10px;
  height: 15px;
`;
