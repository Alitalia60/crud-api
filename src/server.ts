import http, { Server, request } from 'http';
import { mapRouter } from './api/routes/router';
import { IncomingMessage, ServerResponse } from 'http';
import { getBodyData } from './api/services/getBodyData';
import { requestFetch } from './api/services/requestFetch.js'

const host = 'http://127.0.0.1';

export const singleServer = (port: number): void => {
  const server: Server = http.createServer(mapRouter);

  server.listen(port, () => {
    console.log(`Load balancer is running at ${host}:${port}/`);
  });
}

export const loadBalancer = (port: number): void => {
  const server: Server = http.createServer(async (request: IncomingMessage, response: ServerResponse) => {
    const { method, url } = request;
    let reqBody = '';
    let config = {
      method: method
    };

    if (method) {
      if (['PUT', 'POST'].includes(method)) {
        reqBody = await getBodyData(request);
        // console.log(`reqBody: `, reqBody);
      }
      if (reqBody) {
        let config = {
          method: method,
          body: JSON.stringify(reqBody)
        };

      }
    };

    const workerUrl = `${host}:${port + 1}${url}`;
    console.log(`workerUrl= ${workerUrl}`);

    // const workerResponse = await requestFetch(workerUrl, config);

    // console.log(`workerResponse: ${workerResponse}`);

    // response.end(`LB gets ${method}, ${url}`);
    // response.setHeader('location', `${host}:4001${url}`)
    // response.setHeader('statusCode', 307)
    // response.end(`LB gets ${host}:${port}${url}`);
    response.end();
    // response.end(workerResponse);
    // const workerResponse: ServerResponse = await fetch(`${host}:${port}${url}`)
    // await fetch(`${host}:${port}${url}`)


  });

  server.listen(port, () => {
    console.log(`Server is running at http://127.0.0.1:${port}/`);
  });
}