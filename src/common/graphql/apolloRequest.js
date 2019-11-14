import {ApolloClient} from 'apollo-client'
import {createHttpLink} from 'apollo-link-http'
import {InMemoryCache, IntrospectionFragmentMatcher} from 'apollo-cache-inmemory'
import {ApolloLink} from 'apollo-link'
import {onError} from 'apollo-link-error'
import store from '@store'

//配置请求路径
const httpLink = createHttpLink({
  uri: process.env.VUE_APP_APOLLOHOST,
  credentials: 'include'
});

//中间件添加请求头
const middlewareLink = new ApolloLink((operation, forward) => {
  let headers = {};
  
  if (store.state.jwt){
    headers['Authorization'] = 'Bearer ' + store.state.jwt;
  }

  operation.setContext({
    headers: headers
  });

  return forward(operation).map(response => {
    return response
  });
});


//中间件添加错误请求
const errorLink = onError(({networkError, response}) => {
  let errorMsg = ''
  if (!!response && response.errors !== undefined && response.errors.length) {
    errorMsg = !response.errors[0].message ? '服务器错误' : response.errors[0].message
  }
  if (!!networkError) {
    errorMsg = networkError.message
    if (networkError.result !== undefined) {
      errorMsg = networkError.result.success === false ? networkError.result.message : networkError.result.error
    }
  }
  if (!!errorMsg) {
    console.log(errorMsg);
  }
});

const authLink = middlewareLink.concat(httpLink)

const defaultOptions = {
  watchQuery: {
    fetchPolicy: 'network-only',
    errorPolicy: 'ignore'
  },
  query: {
    fetchPolicy: 'network-only',
    errorPolicy: 'all'
  },
  $loadingKey: 'loading'
}


const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData: {
    __schema: {
      types: [
        {
          kind: 'INTERFACE',
          name: 'Document',
          possibleTypes: [
            {name: 'MyInterface1'},
            {name: 'SomeInterface2'}
          ]
        }
      ]
    }
  }
});


const apolloClient = new ApolloClient({
  link: errorLink.concat(authLink),
  cache: new InMemoryCache({fragmentMatcher}),
  connectToDevTools: true,
  //shouldBatch: true,
  defaultOptions: defaultOptions
});

export default apolloClient;
