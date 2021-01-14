import { Select, Image } from 'antd';
import React, { useState } from 'react';
import styled from 'styled-components';
import { ArticleCard } from '../ArticleCard';
import { useResource } from '../Resource';

const { Option } = Select;

export const TEST_ARTICLE: ArticleAPI.Article = {
  id: 1,
  title: 'Test Article',
  subtitle: 'Something in the subtitle',
  description: 'asdjfhal skdjf alksjdflaksjdhf lakshdf kasdjfh ',
  images: [
    'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
  ],
  tags: [],
  createdAt: '2020-07-14',
};

export const PageHome: React.FunctionComponent = () => {
  const [articles = []] = useResource<ArticleAPI.Article[]>(`articles`);
  const [articleTags = []] = useResource<ArticleAPI.ArticleTag[]>(
    `/articles/tags`
  );
  const [tagName, setTagName] = useState<string | undefined>(undefined);
  const [filtered, setFiltered] = useState<ArticleAPI.Article[]>(articles);

  React.useEffect(() => setFiltered(articles), [articles.length]);
  React.useEffect(() => {
    setFiltered(
      articles.filter(
        (a) =>
          tagName === '' ||
          a.tags.some((t) => t.name.toLowerCase() === tagName?.toLowerCase())
      )
    );
  }, [tagName]);

  const first10 = filtered.slice(0, 6);
  const last3 = filtered.slice(7, 10);

  return !filtered ? (
    <span />
  ) : (
    <StyledContainer>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Header>
          Experience
          <Select
            value={tagName || ''}
            onSelect={(tag) => {
              setTagName(tag);
            }}
            style={{ width: 220 }}
            bordered={false}
          >
            <Option key={`tag-0`} value={''} title={'All'}>
              All
            </Option>
            {articleTags.map((t) => (
              <Option key={`tag-${t.id}`} value={t.name} title={t.name}>
                {t.name}
              </Option>
            ))}
          </Select>{' '}
          Nashville
        </Header>
      </div>
      <div
        style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}
      >
        {first10.map((a) => (
          <ArticleCard article={a} />
        ))}
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          padding: '60px 0px',
        }}
      >
        <Image
          width={400}
          src='https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
        />
      </div>
      <div
        style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}
      >
        {last3.map((a) => (
          <ArticleCard article={a} />
        ))}
      </div>
    </StyledContainer>
  );
};

async function createUser() {
  const resp = await fetch(`/user`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      username: 'miltonian',
      password: 'asdf',
    }),
  });
  return resp;
}
async function loginUser() {
  const resp = await fetch(`/auth/login`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      username: 'miltonian',
      password: 'asdf', //right
      // password: 'fdsa', //wrong
    }),
  });
  return resp;
}

const StyledContainer = styled.div`
  display: flex;
  padding: 0px 50px;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  font-size: 26px;
  font-weight: bold;
  padding: 50px;
`;
