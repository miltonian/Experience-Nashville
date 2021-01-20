import { Image } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { RouteComponentProps } from 'react-router-dom';
import { useResource } from '../Resource';
import moment from 'moment';

export const PageArticleDetail = (
  props: RouteComponentProps<{ articleId: string; articleTitle: string }>
) => {
  const { articleId } = props.match.params;
  const [article] = useResource<ArticleAPI.Article>(`/articles/${articleId}`);

  if (!article) {
    return <span />;
  }
  return (
    <Container>
      <Header>
        {article.title}
        <br />
        <span style={{ fontSize: 16, fontWeight: 'normal' }}>
          {moment(article.scheduledAt || article.createdAt).format(
            'MMM DD, YYYY'
          )}
        </span>
      </Header>

      {article.images && article.images.length > 0 && (
        <Image src={article.images[0]} style={{ width: 'auto', height: 600 }} />
      )}

      <div
        style={{ padding: '80px 100px', maxWidth: 900, width: '100%' }}
        dangerouslySetInnerHTML={{ __html: article.description }}
      />

      <SocialContainer>
        Share:
        <SocialIcon src={require('../images/instagram@2x.png').default} />
        <SocialIcon src={require('../images/facebook@2x.png').default} />
        <SocialIcon src={require('../images/pinterest@2x.png').default} />
      </SocialContainer>

      <BottomLine />
    </Container>
  );
};

const SocialIcon = styled.img`
  padding: 0px 10px;
  height: 15px;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const Header = styled.div`
  font-size: 36px;
  font-weight: bold;
  padding: 80px 100px;
  max-width: 900px;
  width: 100%;
`;

const SocialContainer = styled.div`
  display: flex;
  justify-content: left;
  align-items: center;
  padding: 20px 100px;
  max-width: 900px;
  width: 100%;
`;

const BottomLine = styled.div`
  width: 100%;
  background-color: black;
  height: 3px;
  max-width: 700px;
  padding: 0px 100px;
`;
