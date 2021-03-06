import { Select, Button, Input, message, Upload, DatePicker } from 'antd';
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
import moment from 'moment';
import RichTextEditor from 'react-rte';

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
  const title = props.match.params.title || '';
  const [tags = []] = useResource<string[]>(`/articles/tags`);
  const [uploading, setUploading] = useState<boolean>(false);
  const [values, setValues] = useState<ArticleAPI.Article>({
    ...BLANK_ARTICLE,
    title,
  });
  const [editorText, setEditorText] = useState(
    RichTextEditor.createValueFromString(article?.description || '', 'html')
  );

  const history = useHistory();

  React.useEffect(() => {
    if (article) {
      setValues(article);
      setEditorText(
        RichTextEditor.createValueFromString(article.description, 'html')
      );
    }
  }, [!!article]);

  const handleChange = (info: UploadChangeParam<UploadFile<any>>) => {
    if (info.file.status === 'uploading') {
      setUploading(true);
      return;
    }
    if (info.file.status === 'done') {
      setValues({
        ...values,
        images: [JSON.parse(info.file.xhr.response).url],
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
          <InputContainer>
            <Upload
              name='article'
              listType='picture-card'
              className='avatar-uploader'
              showUploadList={false}
              action={`/articles/image/article-${values?.id}-${
                encodeURIComponent(moment().unix() + values?.title) ||
                randomInt(999999999)
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
          </InputContainer>

          <InputContainer>
            <div style={{ padding: '5px 0px' }}>Title</div>
            <Input
              placeholder='Title'
              value={values.title}
              autoFocus
              onChange={(e) => setValues({ ...values, title: e.target.value })}
            />
          </InputContainer>

          <InputContainer>
            <div style={{ padding: '5px 0px' }}>Subtitle</div>
            <Input
              placeholder='Subtitle'
              value={values.subtitle}
              autoFocus
              onChange={(e) =>
                setValues({ ...values, subtitle: e.target.value })
              }
            />
          </InputContainer>

          <InputContainer>
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
                    (t) => t.toLowerCase() === name.toLowerCase()
                  );
                  !found && tags.push(name);
                });
                setValues({
                  ...values,
                  tags: tags
                    .filter((t) => v.includes(t))
                    .map((t) => ({ name: t })),
                });
              }}
            >
              {tags.map((t) => (
                <Select.Option key={`tag-${t}`} value={t}>
                  {t}
                </Select.Option>
              ))}
            </Select>
          </InputContainer>

          <InputContainer>
            <div style={{ padding: '5px 0px' }}>Schedule Post</div>
            <DatePicker
              value={
                values.scheduledAt ? moment(values.scheduledAt) : undefined
              }
              onChange={(value) => {
                console.log(moment(values.scheduledAt));
                console.log(value);
                setValues({ ...values, scheduledAt: moment(value).format() });
              }}
            />
          </InputContainer>

          <InputContainer>
            <div style={{ padding: '5px 0px' }}>Description</div>
            {/* <Input.TextArea
              placeholder='Description'
              value={values.description}
              autoFocus
              onChange={(e) =>
                setValues({ ...values, description: e.target.value })
              }
            /> */}
            <RichTextEditor
              value={editorText}
              onChange={(val) => val && setEditorText(val)}
            />
          </InputContainer>
        </div>

        <div style={{ display: 'flex' }}>
          <Button
            style={{ margin: '0px 10px' }}
            type='primary'
            onClick={async () => {
              const resp = await makeRequest<ArticleAPI.Article | undefined>(
                `/articles`,
                'POST',
                {
                  values: {
                    ...values,
                    description: editorText.toString('html'),
                  },
                }
              );
              if (resp) {
                setValues(resp);
                message.success(`Saved`);
                history.goBack();
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

export function beforeUpload(file: RcFile) {
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

const StyledContainer = styled.div`
  display: flex;
  padding: 0px 50px;
  flex-direction: column;
`;

export const InputContainer = styled.div`
  padding: 10px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  font-size: 26px;
  font-weight: bold;
  padding: 50px;
`;
