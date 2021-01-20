import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const NavigationBar: React.FunctionComponent = () => {
  return (
    <NavigationContainer>
      <Link style={{ flex: 1 }} to={`/`}>
        <img src={require('./images/expnash-icon.jpeg').default} />
      </Link>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <NavigationItem style={{ padding: 10 }}>Contact</NavigationItem>
        <SocialIcon src={require('./images/instagram@2x.png').default} />
        <SocialIcon src={require('./images/facebook@2x.png').default} />
        <SocialIcon src={require('./images/pinterest@2x.png').default} />
      </div>
    </NavigationContainer>
  );
};

const NavigationContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 0px 50px;
`;

const NavigationItem = styled.div`
  padding: 10px;
`;

const SocialIcon = styled.img`
  padding: 0px 10px;
  height: 15px;
`;
