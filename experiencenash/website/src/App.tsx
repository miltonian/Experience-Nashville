import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams,
  useHistory,
} from 'react-router-dom';
import { NavigationBar } from './NavigationBar';
import { PageHome } from './pages/PageHome';
import { PageArticleDetail } from './pages/PageArticleDetail';
import { PageAdminEdit } from './pages/PageAdminEdit';
import { FooterSection } from './FooterSection';
import { PageAdminEditArticle } from './pages/PageAdminEditArticle';
import { PageAdminEditAds } from './pages/PageAdminEditAds';
import Layout, { Content } from 'antd/lib/layout/layout';
import { Menu } from 'antd';
import Sider from 'antd/lib/layout/Sider';

export const App: React.FunctionComponent = () => {
  function Admin() {
    let { path } = useRouteMatch();

    const history = useHistory();
    return (
      <div>
        <Layout>
          <Sider width={200} theme={'light'}>
            <Menu mode='vertical'>
              <Menu.Item
                key='page-ads'
                onClick={() => history.push(`${path}/ads`)}
              >
                Ads
              </Menu.Item>
              <Menu.Item
                key='page-articles'
                onClick={() => history.push(`${path}`)}
              >
                Articles
              </Menu.Item>
            </Menu>
          </Sider>
          <Content>
            <Switch>
              <Route path={`${path}/ads`}>
                <PageAdminEditAds />
              </Route>
              <Route
                key={'articleDetail'}
                path={`${path}/article/:id/edit/:title`}
                component={PageAdminEditArticle}
              />
              <Route path={`${path}`}>
                <PageAdminEdit />
              </Route>
            </Switch>
          </Content>
        </Layout>
      </div>
    );
  }

  return (
    <Router>
      <div>
        <NavigationBar />

        <Switch>
          <Route
            key={'articleDetail'}
            path='/article/:articleId/:articleTitle'
            component={PageArticleDetail}
          />
          <Route path='/admin'>
            <Admin />
          </Route>
          <Route path='/'>
            <PageHome />
          </Route>
        </Switch>
        <FooterSection />
      </div>
    </Router>
  );
};

function About() {
  return <h2>About</h2>;
}

function Topics() {
  let match = useRouteMatch();

  return (
    <div>
      <h2>Topics</h2>

      <ul>
        <li>
          <Link to={`${match.url}/components`}>Components</Link>
        </li>
        <li>
          <Link to={`${match.url}/props-v-state`}>Props v. State</Link>
        </li>
      </ul>

      {/* The Topics page has its own <Switch> with more routes
          that build on the /topics URL path. You can think of the
          2nd <Route> here as an "index" page for all topics, or
          the page that is shown when no topic is selected */}
      <Switch>
        <Route path={`${match.path}/:topicId`}>
          <Topic />
        </Route>
        <Route path={match.path}>
          <h3>Please select a topic.</h3>
        </Route>
      </Switch>
    </div>
  );
}

function Topic() {
  // let { topicId } = useParams();
  // return <h3>Requested topic ID: {topicId}</h3>;
  return <h3>Requested topic ID</h3>;
}
export default App;
