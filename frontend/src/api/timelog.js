// Timelogs api consists of Create, Fetch/Get/Search, Update, Delete

export async function createTimelog(data) {
  const response = await fetch(`/api/timelogs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return await response.json()
}

export async function fetchTimelogAll(data) {
  const response = await fetch('/api/timelogs/timelog?' +
  new URLSearchParams({
    timelogId: data.timelogId
  }))
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

export async function fetchTimelogByCustomerIdActive(data) {
  const response = await fetch(`/api/timelogs/search/customer/active`, {
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

export async function fetchTimelogRoomDateRange(data) {
  const response = await fetch(`/api/timelogs/search/room/range`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return await response.json()
}

export async function fetchActiveTimelogByRoom(data) {
  const response = await fetch(`/api/timelogs/search/room/active`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return await response.json()
}

export async function fetchActiveTimelog(data) {
  const response = await fetch(`/api/timelogs/search/active`, {
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

export async function deleteTimelogByCustomerId(data) {
  const response = await fetch(`/api/timelogs/delete/customerId`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return await response.json()
}

export async function deleteTimelog(data) {
  const response = await fetch(`/api/timelogs/delete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return await response.json()
}
