export async function requestFetch(
  url = '',
  // `RequestInit` is a type for configuring
  // a `fetch` request. By default, an empty object.
  config = {}

  // This function is async, it will return a Promise:
) {
  // Inside, we call the `fetch` function with
  // a URL and config given:
  return (
    // fetch(url, config)
    fetch(url, config)
      // When got a response call a `json` method on it
      .then((response) => response.json())
      // and return the result data.
      .then((data) => data)
  );

  // We also can use some post-response
  // data-transformations in the last `then` clause.
}
