import React, { useContext, useEffect, useState } from 'react';
import LoginForm from './components/LoginForm';
import { Context } from '.';
import { observer } from 'mobx-react-lite';
import UserService from './services/userService';
import { IUser } from './models/IUser';

function App() {
  const {store} = useContext(Context)
  const [users, setUsers] = useState<IUser[]>([])  

  useEffect(() => {
    if(localStorage.getItem('token')) {      
      store.checkAuth()
    }
  }, [])

  const getUsers = async () => {
    setUsers((await UserService.fetchUsers()).data)
  }

  if(store.isLoading) {
    return <div>Loading...</div>
  }

  if(!store.isAuth) {
    return (
      <div className="App">
        <h1>Not authorized</h1>
        <LoginForm/>
        <button onClick={() => getUsers()}>Get users</button>
      </div>
    )
  }

  return (
    <div className="App">
      <h1>{`User authorized: ${store.user?.email}`}</h1>
      <h1>{store.user.isActivated ? 'Account is activated' : 'ACTIVATE YOUR ACCOUNT!'}</h1>
      <button onClick={async () => await store.logout()}>Logout</button>
      <button onClick={() => getUsers()}>Get users</button>
      {
        users.map(user => <div key={user.id}>{user.email}</div>)
      }
    </div>
  )
}

export default observer(App)
