```tsx
const { id, view, path, params, redirect } = useRouter({
  default: () => {},
  "/config": () => {},
  "/user/[id]": () => {},
});
```

```tsx
<RouterSwitch>
  <RouterCase path="/" load={() => {}} />
  <RouterCase path="/config" load={() => {}} />
  <RouterCase path="/user/[id]" load={() => {}} />
</RouterSwitch>
```
