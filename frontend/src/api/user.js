
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

