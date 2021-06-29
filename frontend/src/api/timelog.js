// Timelogs api consists of Create, Fetch/Get/Search, Update, Delete

export async function createTimelog(data) {
  const response = await fetch(`/api/timelogs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return await response.json()
}

export async function fetchTimelogById(data) {
  const response = await fetch('/api/timelogs/timelog?' +
  new URLSearchParams({
    timelogId: data.timelogId
  }))
  return await response.json()
}

export async function fetchTimelogByCustomerId(data) {
  const response = await fetch(`/api/timelogs/search/customer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return await response.json()
}

export async function fetchTimelogByRoomId(data) {
  const response = await fetch(`/api/timelogs/search/room`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return await response.json()
}

export async function fetchTimelogByDate(data) {
  const response = await fetch(`/api/timelogs/search/room/date`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return await response.json()
}

export async function updateTimelogById(data) {
  const response = await fetch(`/api/timelogs/update`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return await response.json()
}

export async function deleteTimelog(data) {
  const response = await fetch('/api/timelogs/' +
  new URLSearchParams({
    timelogId: data.timelogId
  }), {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return await response.json()
}
