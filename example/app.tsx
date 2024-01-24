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

const Loading = () => (
  <div class="loading">
    <h1>Loading</h1>
  </div>
);

const delay = () => new Promise((resolve) => setTimeout(resolve, 200));

export default ({ base }: { base: string }) => (
  <host>
    <RouterSwitch base={base} id="parent">
      <RouterCase
        path="/"
        cache
        load={async function* () {
          yield <Loading />;
          const { results } = await request("?limit=252");
          return (
            <div class="grid">
              {results.map(({ name }, id) => (
                <a class="card" href={`/pokemon/${id + 1}`}>
                  {thumbnail(id + 1)}
                  <span>{name}</span>
                </a>
              ))}
            </div>
          );
        }}
      />
      <RouterCase
        path="/pokemon/{id}/*"
        cache
        load={async function* ({ id }) {
          yield <Loading />;
          await delay();
          const { name } = await request(`/${id}`);
          return (
            <div class="single">
              <div class="card">
                {thumbnail(id)}
                <h1>{name}</h1>
                <div class="pagination">
                  <a class="button" href={`/pokemon/${id}`}>
                    Detail
                  </a>
                  <a class="button" href={`/pokemon/${id}/abilities`}>
                    Abilities
                  </a>
                </div>
                <div>
                  <RouterSwitch>
                    <RouterCase
                      path="/"
                      cache
                      load={async function* () {
                        return (
                          <>
                            <h3>Detail</h3>
                            <p>
                              Lorem ipsum, dolor sit amet consectetur
                              adipisicing elit. Quas suscipit voluptate
                              veritatis alias doloremque id corrupti iure?
                              Nulla, quo. Excepturi ad quasi tempora optio
                              cumque veritatis nam ratione dolore voluptatem!
                            </p>
                          </>
                        );
                      }}
                    ></RouterCase>
                    <RouterCase
                      path="/abilities"
                      cache
                      load={async function* () {
                        return (
                          <>
                            <h3>Abilities</h3>
                            <p>
                              Lorem ipsum, dolor sit amet consectetur
                              adipisicing elit. Quas suscipit voluptate
                              veritatis alias doloremque id corrupti iure?
                              Nulla, quo. Excepturi ad quasi tempora optio
                              cumque veritatis nam ratione dolore voluptatem!
                            </p>
                          </>
                        );
                      }}
                    ></RouterCase>
                  </RouterSwitch>
                </div>
                <div class="pagination">
                  <a class="button" href={`/pokemon/${Number(id) - 1 || 1}`}>
                    Prev
                  </a>
                  <a class="button" href="/">
                    Home
                  </a>
                  <a class="button" href={`/pokemon/${Number(id) + 1}`}>
                    Next
                  </a>
                </div>
              </div>
            </div>
          );
        }}
      />
      <RouterCase path="/[...notFound]" element={"h1"}></RouterCase>
    </RouterSwitch>
  </host>
);
