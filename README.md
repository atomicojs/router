# @atomico/router

```jsx
function component() {
  return (
    <host>
      <RouterSwitch>
        <RouterCase path="/" for="home"></RouterCase>
        <RouterCase
          path="/{id}"
          load={async (params) => {
            const { data } = await getArticle(params.id);
            return <Article data={data} />;
          }}
        ></RouterCase>
        <MyHome slot="home" />
      </RouterSwitch>
    </host>
  );
}
```

```jsx
<RouterCase memo preload></RouterCase>
```

## memo

permite que cada ruta resuleta, se llame una sola vez.

## preload

Al notar inactividad, routerSwitch ejecutara el metodo load para asi evitar la espera en caso de que la ruta se resuelva.
