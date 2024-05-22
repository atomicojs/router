import autoAnimate from "@formkit/auto-animate";
import { c, useSuspense } from "atomico";
import { RouterCase, RouterSwitch } from "../src";
import { getAll, getById, getImageById } from "./api";
import { Pokemon } from "./components/pokemon";
import { PokemonImage } from "./components/pokemon-image";
import { PokemonTabs } from "./components/pokemon-tabs";
import { PokemonType } from "./components/pokemon-type";
import * as Icon from "./icons";

const PokemonApp = c(() => {
  const promises = useSuspense();
  return (
    <host>
      <div class="phone">
        <RouterSwitch id="parent" ref={autoAnimate}>
          <RouterCase
            default
            cache
            load={async function ({ id }) {
              const { results } = await getAll();
              return (
                <div class="grid ">
                  {results.map(({ name, id }) => (
                    <a href={`/pokemon/${id}`}>
                      <Pokemon thumbnail>
                        <PokemonImage
                          slot="image"
                          src={getImageById(id)}
                        ></PokemonImage>
                        <h3 class="text-capital">{name}</h3>
                      </Pokemon>
                    </a>
                  ))}
                </div>
              );
            }}
          />
          <RouterCase
            path="/pokemon/{id}/[view]"
            load={async function (props) {
              const pokemon = await getById(props.id);
              await new Promise((resolve) => setTimeout(resolve, 1000));
              const id = Number(props.id);
              return (
                <Pokemon>
                  <PokemonImage
                    slot="image"
                    src={getImageById(id)}
                  ></PokemonImage>
                  <header class="header">
                    <h1 class="text-capital">{pokemon.name}</h1>
                    <div class="row">
                      {pokemon.types.map(({ type }) => (
                        <PokemonType type={type.name}></PokemonType>
                      ))}
                    </div>
                  </header>
                  <RouterSwitch base={`/pokemon/${props.id}`}>
                    <PokemonTabs>
                      <a class={props.view == "" ? "active" : ""} href="/">
                        Stats
                      </a>
                      <a
                        class={props.view == "moves" ? "active" : ""}
                        href="/moves"
                      >
                        Moves
                      </a>
                    </PokemonTabs>
                    <RouterCase
                      default
                      load={function () {
                        return (
                          <div class="content">
                            <strong>Stats: {pokemon.name}</strong> Lorem ipsum
                            dolor sit amet consectetur adipiscing elit lectus
                            nullam, donec penatibus vehicula orci habitant urna
                            integer posuere, est morbi etiam conubia scelerisque
                            lacinia magna odio. Natoque ornare congue varius
                            aenean potenti nullam placerat pellentesque cursus.
                          </div>
                        );
                      }}
                    />
                    <RouterCase
                      path="/moves"
                      load={function () {
                        return (
                          <div class="content">
                            <strong>Moves:</strong> Lorem ipsum dolor sit amet
                            consectetur adipiscing elit lectus nullam, donec
                            penatibus vehicula orci habitant urna integer
                            posuere, est morbi etiam conubia scelerisque lacinia
                            magna odio. Natoque ornare congue varius aenean
                            potenti nullam placerat pellentesque cursus.
                          </div>
                        );
                      }}
                    />
                  </RouterSwitch>
                  <footer class="row">
                    <a class="link-icon" href={`/pokemon/${id - 1}`}>
                      <Icon.Left />
                    </a>
                    <a class="link-icon" href={`/`}>
                      <Icon.Home />
                    </a>
                    <a class="link-icon" href={`/pokemon/${id + 1}`}>
                      <Icon.Right />
                    </a>
                  </footer>
                </Pokemon>
              );
            }}
          />
        </RouterSwitch>
      </div>
    </host>
  );
});

customElements.define("pokemon-app", PokemonApp);
