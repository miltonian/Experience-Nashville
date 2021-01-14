import React from 'react';
import { Card } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import Meta from 'antd/lib/card/Meta';
import { Link, useHistory } from 'react-router-dom';

export const ArticleCard: React.FunctionComponent<{
  article: ArticleAPI.Article;
}> = ({ article }) => {
  const history = useHistory();
  return (
    <Link to={`/article/${article.id}/${article.title}`}>
      <Card
        style={{ width: 350, margin: '30px 20px' }}
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
      </Card>
    </Link>
  );
};
