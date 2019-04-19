export const jsonFetch = (url, opts) =>
  fetch(url, {
    headers: {
      'Content-type': 'application/json'
    },
    ...opts
  }).then(response => response.json());
