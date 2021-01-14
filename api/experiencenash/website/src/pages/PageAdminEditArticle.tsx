import { Select, Image, Table, Button, Input, message, Upload } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import { RcFile, UploadChangeParam } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';
import React, { useState } from 'react';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { ArticleCard } from '../ArticleCard';
import { makeRequest, useResource } from '../Resource';
import { TEST_ARTICLE } from './PageHome';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { randomInt } from 'crypto';

const { Option } = Select;

const BLANK_ARTICLE: ArticleAPI.Article = {
  id: -1,
  title: '',
  subtitle: '',
  description: ' ',
  images: [],
  tags: [],
  createdAt: '',
};

export const PageAdminEditArticle = (
  props: RouteComponentProps<{ id?: string; title?: string }>
) => {
  const [article] = useResource<ArticleAPI.Article>(
    `/articles/${props.match.params.id}`
  );
  const [tags = []] = useResource<ArticleAPI.ArticleTag[]>(`/articles/tags`);

  const [values, setValues] = useState<ArticleAPI.Article>({
    ...BLANK_ARTICLE,
    title: props.match.params.title || '',
  });
  const [tagId, setTagId] = useState<number | undefined>(undefined);
  const [uploading, setUploading] = useState<boolean>(false);

  const history = useHistory();

  React.useEffect(() => {
    article && setValues(article);
  }, [!!article]);

  function beforeUpload(file: RcFile) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 20;
    if (!isLt2M) {
      message.error('Image must smaller than 20MB!');
    }
    return isJpgOrPng && isLt2M;
  }

  const handleChange = (info: UploadChangeParam<UploadFile<any>>) => {
    if (info.file.status === 'uploading') {
      setUploading(true);
      return;
    }
    if (info.file.status === 'done') {
      const S3_URL = 'https://expnash.s3.us-east-2.amazonaws.com/';
      setValues({
        ...values,
        images: [`${S3_URL}${JSON.parse(info.file.xhr.response).url}`],
      });
      setUploading(false);
    }
  };

  return (
    <StyledContainer>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ width: '100%', maxWidth: 900 }}>
          <Header style={{ flex: 1 }}>New Article</Header>
          <div style={{ padding: 10 }}>
            <div style={{ padding: '5px 0px' }}>Title</div>
            <Upload
              name='article'
              listType='picture-card'
              className='avatar-uploader'
              showUploadList={false}
              // action='https://www.mocky.io/v2/5cc8019d300000980a055e76'
              action={`/articles/image/article-${values?.id}-${
                encodeURI(values?.title) || randomInt(999999999)
              }.png`}
              beforeUpload={beforeUpload}
              onChange={handleChange}
            >
              {values.images && values.images.length > 0 ? (
                <img
                  src={values.images[0]}
                  alt='avatar'
                  style={{ width: '100%' }}
                />
              ) : (
                <div>
                  {uploading ? <LoadingOutlined /> : <PlusOutlined />}
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
          </div>

          <div style={{ padding: 10 }}>
            <div style={{ padding: '5px 0px' }}>Title</div>
            <Input
              placeholder='Title'
              value={values.title}
              autoFocus
              onChange={(e) => setValues({ ...values, title: e.target.value })}
            />
          </div>

          <div style={{ padding: 10 }}>
            <div style={{ padding: '5px 0px' }}>Subtitle</div>
            <Input
              placeholder='Subtitle'
              value={values.subtitle}
              autoFocus
              onChange={(e) =>
                setValues({ ...values, subtitle: e.target.value })
              }
            />
          </div>

          <div style={{ padding: 10 }}>
            <div style={{ padding: '5px 0px' }}>Categories</div>
            <Select
              mode='tags'
              allowClear
              style={{ width: '100%' }}
              placeholder='Please select'
              value={values.tags?.map((t) => t.name) || []}
              onChange={(v) => {
                v.forEach((name) => {
                  const found = tags.find(
                    (t) => t.name.toLowerCase() === name.toLowerCase()
                  );
                  !found && tags.push({ id: -1, name: name });
                });
                console.log(v);
                setValues({
                  ...values,
                  tags: tags.filter((t) => v.includes(t.name)),
                });
              }}
            >
              {tags.map((t) => (
                <Select.Option key={`tag-${t.name}`} value={t.name}>
                  {t.name}
                </Select.Option>
              ))}
            </Select>
          </div>

          <div style={{ padding: 10 }}>
            <div style={{ padding: '5px 0px' }}>Description</div>
            <Input.TextArea
              placeholder='Description'
              value={values.description}
              autoFocus
              onChange={(e) =>
                setValues({ ...values, description: e.target.value })
              }
            />
          </div>
        </div>

        <div style={{ display: 'flex' }}>
          <Button
            style={{ margin: '0px 10px' }}
            type='primary'
            onClick={async () => {
              const resp = await makeRequest<ArticleAPI.Article | undefined>(
                `/articles`,
                'POST',
                { values }
              );
              if (resp) {
                setValues(resp);
                message.success(`Saved`);
              } else {
                message.error(`Something went wrong`);
              }
            }}
          >
            Save
          </Button>
          <Button onClick={() => history.goBack()}>Back</Button>
        </div>
      </div>
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
        history.push(`admin/article/new?t=${title}`);
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
