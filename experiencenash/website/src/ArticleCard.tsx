import React from 'react';
import { Card } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import Meta from 'antd/lib/card/Meta';
import { Link, useHistory } from 'react-router-dom';
import styled from 'styled-components';

export const ArticleCard: React.FunctionComponent<{
  article: ArticleAPI.Article;
}> = ({ article }) => {
  const history = useHistory();
  return (
    <Link to={`/article/${article.id}/${article.title}`}>
      <StyledCard
        cover={
          article.images &&
          article.images.length > 0 && (
            <img alt='example' src={article.images[0]} />
          )
        }
        actions={
          [
            // <SettingOutlined key="setting" />,
            // <EditOutlined key="edit" />,
            // <EllipsisOutlined key="ellipsis" />,
          ]
        }
      >
        <Meta
          // avatar={
          //   <Avatar src='https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png' />
          // }
          title={article.title}
          description={article.subtitle}
        />
      </StyledCard>
    </Link>
  );
};

const StyledCard = styled(Card)`
  width: 350px;
  margin: 30px 20px;
  & .ant-card-cover {
    height: 230px;
    overflow: hidden;
  }
`;
