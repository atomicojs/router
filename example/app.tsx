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
    <RouterSwitch>
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
        path="/{id}"
        memo
        load={async function* ({ id }) {
          yield "Loading...";
          await delay();
          const { abilities, name } = await request(`/${id}`);
          return (
            <div class="single">
              <div class="card">
                {thumbnail(id)}
                <h1>{name}</h1>
                <h2>Abilities</h2>
                <ul>
                  {abilities.map(({ ability }) => (
                    <li>{ability.name}</li>
                  ))}
                </ul>
                <div class="pagination">
                  <a class="button" href={`/${Number(id) + 1}`}>
                    Prev
                  </a>
                  <a class="button" href="/">
                    Home
                  </a>
                  <a class="button" href={`/${Number(id) - 1}`}>
                    Next
                  </a>
                </div>
              </div>
            </div>
          );
        }}
      />
    </RouterSwitch>
  </host>
);

vdom.render(document.body);
