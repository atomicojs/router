# [documentation in atomico.gitbook.io](https://atomico.gitbook.io/doc/atomico/atomico-router)

```tsx
<Router>
  <RouterCase
    cache
    expires={10000}
    path="/"
    load={async function* ({ id }, signal) {
      yield <Loading />;
      const user = await getUserById(signal);
      return <User {...user} />;
    }}
  />
</Router>
```
