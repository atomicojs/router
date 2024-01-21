import { RouterSwitch, RouterCase } from "../src/router";

const request = (path) =>
  fetch(`https://pokeapi.co/api/v2/pokemon${path}`).then((res) => res.json());

const thumbnail = (id) => (
  <img
    width={96}
    height={96}
    loading="lazy"
    class="thumbnail"
    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
  />
);

const loading = () => (
  <div class="loading">
    <h1>Loading</h1>
  </div>
);

const delay = () => new Promise((resolve) => setTimeout(resolve, 500));

const vdom = (
  <host>
    <RouterSwitch id="parent">
      <RouterCase
        path="/"
        memo
        load={async function* () {
          yield "Loading...";
          const { results } = await request("?limit=252");
          return (
            <div class="grid">
              {results.map(({ name }, id) => (
                <a class="card" href={`/${id + 1}`}>
                  {thumbnail(id + 1)}
                  <span>{name}</span>
                </a>
              ))}
            </div>
          );
        }}
      />
      <RouterCase
        path="/{id}/[...options]"
        memo
        load={async function* ({ id, options }) {
          return (
            <>
              <header>
                view: {id} - {options}
              </header>
              <RouterSwitch id="child">
                <RouterCase
                  path="/"
                  memo
                  load={async function* (params, signal) {
                    console.log(signal);
                    yield "Loading...";
                    await delay();
                    const { abilities, name } = await request(
                      `/${params.parentId}`
                    );
                    return (
                      <div class="single">
                        <div class="card">
                          {thumbnail(params.parentId)}
                          <h1>{name}</h1>
                          <h2>Abilities</h2>
                          <ul>
                            {abilities.map(({ ability }) => (
                              <li>{ability.name}</li>
                            ))}
                          </ul>
                          <div class="pagination">
                            <a
                              class="button"
                              href={`/${Number(params.parentId) + 1}`}
                            >
                              Prev
                            </a>
                            <a class="button" href="/">
                              Home
                            </a>
                            <a
                              class="button"
                              href={`./${params.parentId}/skills`}
                            >
                              Skills
                            </a>
                            <a
                              class="button"
                              href={`/${Number(params.parentId) - 1}`}
                            >
                              Next
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  }}
                ></RouterCase>
                <RouterCase
                  path="/skills"
                  memo
                  load={async function* (params) {
                    yield "Loading...";
                    await delay();
                    const { abilities, name } = await request(
                      `/${params.parentId}`
                    );
                    return (
                      <div class="single">
                        <div class="card">
                          {thumbnail(params.parentId)}
                          <h1>{name} - skills</h1>
                          <h2>Abilities</h2>
                          <ul>
                            {abilities.map(({ ability }) => (
                              <li>{ability.name}</li>
                            ))}
                          </ul>
                          <div class="pagination">
                            <a
                              class="button"
                              href={`/${Number(params.parentId) + 1}`}
                            >
                              Prev
                            </a>
                            <a class="button" href="/">
                              Home
                            </a>
                            <a
                              class="button"
                              href={`/${Number(params.parentId) - 1}`}
                            >
                              Next
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  }}
                ></RouterCase>
              </RouterSwitch>
            </>
          );
        }}
      />
    </RouterSwitch>
  </host>
);

vdom.render(document.body);
