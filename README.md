# @atomico/router

```jsx
import "@atomico/router";

const home = () => import("./home.jsx");

function component() {
    return (
        <host>
            <router-switch>
                <router-case path="/" load={home}></router-case>
                <router-case
                    path="/[...notFound]"
                    load={() => "Not Found"}
                ></router-case>
            </router-switch>
        </host>
    );
}
```
