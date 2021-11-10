# Ngx FeedReader

Simple RSS and Atom feed reader.  

* Runs as a single page web application: No back end
* Uses [OPML](http://opml.org/) to define which feeds are fetched
* Request for a feed is made via a proxy to avoid CORS issues
* Stores Feed articles in [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)

## Getting started

### Prerequisites

* Latest [Node.js](https://www.nodejs.org/) is installed.
* Proxy file created. See the end of this document


**1. Install Angular CLI**:
```
npm install -g @angular/cli
```
**2. Run**:
```
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`
```

## Technology

* Angular
* Angular Material
* IndexedDB

## Proxy Configuration

Create a `/src/app/proxy-config.ts` file

In the file, specify the proxy server and any header information. For example:

```
export const proxyConfig = {
    proxy: 'https://your.proxy.com',
    headers: {
        'your-api-key': 'key'
    }
};
```

Note that the feed url will be appended to the end of the proxy url.  