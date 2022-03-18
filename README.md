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
