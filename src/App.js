import { Route, Switch } from 'react-router-dom'
import Login from './pages/login/login'
import Admin from './pages/admin'

function App() {
  return (
    <>
      <Switch>{/* 只匹配其中一个*/}
        <Route path='/login' component={Login} />
        <Route path='/' component={Admin} />
      </Switch>
    </>
  );
}

export default App;
