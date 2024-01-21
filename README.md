# [documentation in atomico.gitbook.io](https://atomico.gitbook.io/doc/atomico/atomico-router)

```tsx
<Router>
  <RouterCase
    cache
    path="/"
    load={async function* ({ id }) {
      yield <Loading />;
      const user = await getUserById();
      return <User {...user} />;
    }}
  />
</Router>
```

```tsx
const route = new Router();

route.on(
  "/{id}",
  async function* ({ id }) {
    yield <Loading />;
    const user = await getUserById(id);
    return <User {...user} />;
  },
  { memo: true }
);

const route = router.match("/i");
//
const router = createRoute();

router("/", () => {}, { memo: true });

route("/");
```
