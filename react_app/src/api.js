export const jsonFetch = (url, opts) =>
  fetch(url, {
    headers: {
      'Content-type': 'application/json'
    },
    ...opts
  }).then(response => {
    if (!response.ok) {
      return response.text().then(text => {
        throw new Error(text);
      });
    }

    return response.json();
  });
