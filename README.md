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

```

Si entra a la ruta

/site/[id]

y anida un componente con ruta

/[id]

el listener debe ser para el hijo

/site/[id]

```

```

Si entra a la ruta

/site/[id]/[view]

y anida un componente con ruta

/     = /site/*
/[id] = /site/*/[id]

```
