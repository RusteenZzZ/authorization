import { makeAutoObservable } from "mobx";
import { IUser } from "../models/IUser";
import AuthService from "../services/authService";
import axios from 'axios'
import { AuthResponse } from "../models/response/authResponse";
import { API_URL } from "../http";

export default class Store {
  user = {} as IUser
  isAuth = false
  isLoading = false

  constructor() {
    makeAutoObservable(this, {}, {autoBind: true})
  }

  setAuth = (bool: boolean) => {
    this.isAuth = bool
  }

  setUser = (user: IUser) => {
    this.user = user
  }

  setIsLoading = (bool: boolean) => {
    this.isLoading = bool
  }

  login = async (email: string, password: string) => {
    try {
      const response = await AuthService.login(email, password)
      console.log(response);
      
      localStorage.setItem('token', response.data.accessToken)
      this.setAuth(true)
      this.setUser(response.data.user)
    } catch (e) {
      console.log(e);
    }
  }

  register = async (email: string, password: string) => {
    try {
      const response = await AuthService.register(email, password)
      console.log(response);

      localStorage.setItem('token', response.data.accessToken)
      this.setAuth(true)
      this.setUser(response.data.user)
    } catch (e) {
      console.log(e);
    }
  }

  logout = async () => {
    try {
      const response = await AuthService.logout()
      console.log(response);

      localStorage.removeItem('token')
      this.setAuth(false)
      this.setUser({} as IUser)
    } catch (e) {
      console.log(e);
    }
  }

  checkAuth = async () => {
    this.setIsLoading(true)
    try {
      const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, {withCredentials: true})
      console.log(response);
      
      localStorage.setItem('token', response.data.accessToken)
      
      this.setAuth(true)
      this.setUser(response.data.user)
    } catch (e) {
      console.log(e);
    } finally {
      this.setIsLoading(false)
    }
  }
}