import { Input } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { CaretRightOutlined } from '@ant-design/icons';

export const FooterSection: React.FunctionComponent = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        padding: '70px 0px',
      }}
    >
      <div style={{ maxWidth: 600, fontWeight: 'bold', textAlign: 'center' }}>
        <div style={{ fontSize: 26, fontWeight: 600, padding: '20px 0px' }}>
          Stay in touch. We like to give out free things.
        </div>
        <StyledInput
          placeholder={'email address'}
          addonAfter={<CaretRightOutlined />}
        />

        <div
          style={{ marginTop: 80, display: 'flex', justifyContent: 'center' }}
        >
          <div style={{ padding: 10 }}>Back up</div>
          <div style={{ padding: 10 }}>Events</div>
          <div style={{ padding: 10 }}>Contact</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <img
            style={{ maxWidth: 400, marginTop: 20 }}
            src={require('./images/expnash-label.jpeg').default}
          />
        </div>
      </div>
    </div>
  );
};

const StyledInput = styled(Input)`
  width: 80%;
  & .ant-input,
  .ant-input-group-addon {
    border: 0;
    border-bottom: 3px solid black;
    background: transparent;
    font-size: 20px;
    font-weight: bold;
  }
  & .ant-input::placeholder {
    color: black;
  }
`;
