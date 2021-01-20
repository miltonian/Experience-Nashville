import {
  Select,
  Image,
  Table,
  Button,
  Input,
  Drawer,
  Menu,
  Upload,
} from 'antd';
import Layout, { Content } from 'antd/lib/layout/layout';
import Sider from 'antd/lib/layout/Sider';
import SubMenu from 'antd/lib/menu/SubMenu';
import { UploadChangeParam } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';
import Modal from 'antd/lib/modal/Modal';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { InputContainer, beforeUpload } from './PageAdminEditArticle';
import { makeRequest, useResource } from '../Resource';
import moment from 'moment';
import { randomInt } from 'crypto';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { ImportsNotUsedAsValues } from 'typescript';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

const { Option } = Select;

export const PageAdminEditAds: React.FunctionComponent = () => {
  const [ads = [], ops] = useResource<ArticleAPI.Ad[]>(`/ads`);
  const [adModalVisible, setAdModalVisible] = useState<boolean>(false);
  const history = useHistory();
  const [tagId, setTagId] = useState<number | undefined>(undefined);
  const [editAd, setEditAd] = useState<ArticleAPI.Ad | undefined>();

  return !ads ? (
    <span />
  ) : (
    <StyledContainer>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Header style={{ flex: 1 }}>Ads</Header>
        <Button onClick={() => setAdModalVisible(true)}>Add</Button>
      </div>

      {ads.length > 0 && (
        <Table
          columns={[
            {
              title: 'Ad',
              render: (ad: ArticleAPI.Ad) => (
                <div>
                  <img
                    src={ad.imagepath}
                    style={{ height: 40, marginRight: 10 }}
                  />
                  {ad.name}
                </div>
              ),
            },
            {
              title: 'Actions',
              render: (ad: ArticleAPI.Ad) => (
                <div style={{ fontSize: 18 }}>
                  <a
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditAd(ad);
                      setAdModalVisible(true);
                    }}
                  >
                    <EditOutlined />
                  </a>
                  <a
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <DeleteOutlined style={{ color: 'red', marginLeft: 10 }} />
                  </a>
                </div>
              ),
            },
          ]}
          dataSource={ads}
        />
      )}
      <ManageAdModal
        show={adModalVisible}
        editAd={editAd}
        onClose={(updated: boolean) => {
          updated && ops.refresh();
          setAdModalVisible(false);
        }}
      />
    </StyledContainer>
  );
};

const BLANK_AD = {
  id: -1,
  name: '',
  imagepath: '',
};
const ManageAdModal = (props: {
  show: boolean;
  editAd?: ArticleAPI.Ad;
  onClose: (updated: boolean) => void;
}) => {
  const [values, setValues] = useState<ArticleAPI.Ad>(props.editAd || BLANK_AD);
  const [uploading, setUploading] = useState<boolean>(false);
  const history = useHistory();

  React.useEffect(() => props.editAd && setValues(props.editAd), [
    props.editAd,
  ]);

  const handleChange = (info: UploadChangeParam<UploadFile<any>>) => {
    if (info.file.status === 'uploading') {
      setUploading(true);
      return;
    }
    if (info.file.status === 'done') {
      setValues({
        ...values,
        imagepath: JSON.parse(info.file.xhr.response).url,
      });
      setUploading(false);
    }
  };

  return (
    <Modal
      visible={props.show}
      title='Add new ad'
      onOk={async () => {
        await makeRequest(`/ads`, 'PUT', { values });
        props.onClose(true);
      }}
      okText='Save'
      onCancel={() => props.onClose(false)}
    >
      <InputContainer>
        <Upload
          name='article'
          listType='picture-card'
          className='avatar-uploader'
          showUploadList={false}
          action={`/articles/image/article-${values?.id}-${
            encodeURIComponent(moment().unix() + values?.name) ||
            randomInt(999999999)
          }.png`}
          beforeUpload={beforeUpload}
          onChange={handleChange}
        >
          {values.imagepath ? (
            <img
              src={values.imagepath}
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
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '5px 0px' }}>Name</div>
        <Input
          value={values.name}
          placeholder='Name'
          autoFocus
          onChange={(e) => setValues({ ...values, name: e.target.value })}
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
