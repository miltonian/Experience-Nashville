import { Select, Image, Table, Button, Input } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { ArticleCard } from '../ArticleCard';
import { makeRequest, useResource } from '../Resource';
import { TEST_ARTICLE } from './PageHome';

const { Option } = Select;

export const PageAdminEdit: React.FunctionComponent = () => {
  const [articles = []] = useResource<ArticleAPI.Article[]>(`/articles`);
  const [articleModalVisible, setArticleModalVisible] = useState<boolean>(
    false
  );
  const history = useHistory();
  const [tagId, setTagId] = useState<number | undefined>(undefined);

  return !articles ? (
    <span />
  ) : (
    <StyledContainer>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Header style={{ flex: 1 }}>Articles</Header>
        <Button onClick={() => setArticleModalVisible(true)}>Add</Button>
      </div>
      <Table
        onRow={(record, rowIndex) => ({
          onClick: () =>
            history.push(`admin/article/${record.id}/edit/${record.title}`),
        })}
        columns={[
          {
            title: 'Title',
            key: 'title',
            dataIndex: 'title',
          },
          {
            title: 'Subtitle',
            key: 'subtitle',
            dataIndex: 'subtitle',
          },
          //   {
          //     title: 'Tags',
          //     key: 'tags',
          //     dataIndex: 'tags',
          //   },
        ]}
        dataSource={articles}
      />
      <AddArticleModal
        show={articleModalVisible}
        onClose={(updated: boolean) => {
          console.log(`updated: ${JSON.stringify(updated)}`);
          setArticleModalVisible(false);
        }}
      />
    </StyledContainer>
  );
};

const AddArticleModal = (props: {
  show: boolean;
  onClose: (updated: boolean) => void;
}) => {
  const [title, setTitle] = useState<string>('');
  const history = useHistory();
  return (
    <Modal
      visible={props.show}
      title='Add new article'
      onOk={async () => {
        // const resp = await makeRequest(`articles`, 'POST', { title });
        // console.log(resp);
        history.push(`admin/article/edit/${title}`);
        props.onClose(true);
      }}
      okText='Save'
      onCancel={() => props.onClose(false)}
    >
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '5px 0px' }}>Title</div>
        <Input
          placeholder='Title'
          autoFocus
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
    </Modal>
  );
};

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
