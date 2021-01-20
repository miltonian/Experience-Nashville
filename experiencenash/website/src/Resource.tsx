import React from 'react';
// import { message } from 'antd';
import qs from 'query-string';

export async function makeRequest<T>(
  path: string,
  method = 'GET',
  itemPayload: any = null
): Promise<T> {
  const options: any = {
    credentials: 'include',
    method,
  };

  if (itemPayload) {
    options.body = JSON.stringify(itemPayload);
    options.headers = {
      'content-type': 'application/json',
    };
  }
  const response = await fetch(path, options);

  if (response.status === 401) {
    // window.location.href =
    //   (process.env.NODE_ENV === 'production'
    //     ? process.env.REACT_APP_UNAUTHORIZED_REDIRECT_PROD
    //     : process.env.REACT_APP_UNAUTHORIZED_REDIRECT_DEV) ||
    //   `/talent/access-denied?next=${encodeURIComponent(window.location.href)}`;
    window.location.href = '/';
    throw new Error('Redirecting to login');
  }

  const text = await response.text();
  let json = { error: `${response.status} ${response.statusText}` };

  try {
    json = JSON.parse(text);
  } catch (err) {
    console.error(`${method} ${path} returned invalid JSON: ${text}`);
  }

  return json as any;
}

export function useResource<T, U = Partial<T>>(
  path: string,
  query?: { [key: string]: any }
) {
  const [state, setState] = React.useState<
    { value: T; url: string } | undefined
  >(undefined);
  const url = `${path}${path.includes('?') ? '&' : '?'}${
    query ? qs.stringify(query) : ''
  }`;

  React.useEffect(() => {
    const fetch = async () => {
      setState(undefined);
      setState({ url, value: await makeRequest<T>(url, 'GET') });
    };
    void fetch();
  }, [url]);

  const ops = {
    post: async (v: U) => {
      try {
        const resp = await makeRequest<U>(path, 'POST', v);
        if ('id' in resp && state && state.value instanceof Array) {
          state.value.push(resp);
        }
        void console.log('Item created');
      } catch (err) {
        void console.error('Failed to save, try again.');
        throw err;
      }
    },
    put: async (v: U) => {
      try {
        const resp = await makeRequest<U>(path, 'PUT', v);
        if ('id' in resp && state) {
          console.log(resp);
          setState({ ...state, value: Object.assign({}, state.value, resp) });
        }
        void console.log('Changes saved');
      } catch (err) {
        void console.error('Failed to save, try again.');
        throw err;
      }
    },
    putItem: async (item: { id: string | number } & U) => {
      const resp = await makeRequest<any>(`${path}/${item.id}`, 'PUT', item);
      if (resp && 'id' in resp && state && state.value instanceof Array) {
        const nextValue: any = [];
        for (const item of state.value) {
          nextValue.push(item.id === resp.id ? resp : item);
        }
        setState({ ...state, value: nextValue });
      }
      void console.log('Updated successfully');
    },
    delete: async () => {
      await makeRequest<T>(path, 'DELETE');
      void console.log('Deleted successfully');
    },
    deleteItem: async (item: string | number | { id: string | number }) => {
      const itemId = typeof item === 'object' && 'id' in item ? item.id : item;
      await makeRequest<T>(`${path}/${itemId}`, 'DELETE');
      void console.log('Deleted successfully');
      if (state && state.value instanceof Array) {
        setState({
          ...state,
          value: state.value.filter((i) => i.id !== itemId) as any,
        });
      }
    },
    applyLocalUpdates: (v: T) => setState({ url, value: v }),
    refresh: async () => {
      setState({ url, value: await makeRequest<T>(url, 'GET') });
    },
  };

  // Explicitly tell TS this is a tuple of two distinct types, not an array of (T | typeof Ops)
  if (state?.url === url) {
    return [state.value, ops] as [T | undefined, typeof ops];
  } else {
    return [undefined, ops] as [T | undefined, typeof ops];
  }
}
