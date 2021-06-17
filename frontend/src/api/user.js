import axios from 'axios'

export async function login(data) {
  const response = await fetch(`/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return await response.json()
}

export async function getInfo(data) {
  const response = await fetch('/api/getInfo?' +
  new URLSearchParams({
    token: data.token, username: data.username
  }))
  return await response.json()
}

export async function createCustomer(data) {
  const response = await fetch(`/api/customer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return await response.json()
}

export async function fetchCustomerByFirstname(data) {
  const response = await fetch('/api/customers?' +
  new URLSearchParams({
    firstname: data.firstname
  }))
  return await response.json()
}

export async function fetchCustomerById(data) {
  const response = await fetch('/api/customers?' +
  new URLSearchParams({
    customerId: data.customerId
  }))
  return await response.json()
}

export function fetchCustomersList() {
  const response = axios.get('/api/customers')
  return response.data
  // const response = fetch('/api/customers')
  // console.log('Response: ', response)
  // return response.json()
}
