// import axios from 'axios'

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
  const response = await fetch(`/api/customers`, {
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

export async function updateCustomerById(data) {
  const response = await fetch(`/api/customers/update`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return await response.json()
}

export async function deleteById(data) {
  const response = await fetch(`/api/customers/delete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return await response.json()
}

// Search from iMCAA 3rd party API Service
export async function searchCustomers(data) {
  const response = await fetch('/api/search?' +
  new URLSearchParams({
    firstname: data.firstname
  }))
  return await response.json()
}
