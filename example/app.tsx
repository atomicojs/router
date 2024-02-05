import { RouterCase, RouterSwitch } from "../src/router";
import { getById, getAll, getImageById } from "./api";
import { Pokemon } from "./components/pokemon";
import { PokemonTabs } from "./components/pokemon-tabs";
import { PokemonImage } from "./components/pokemon-image";
import { PokemonType } from "./components/pokemon-type";
import autoAnimate from "@formkit/auto-animate";
import * as Icon from "./icons";

export default ({ base }: { base: string }) => (
  <host>
    <div class="phone">
      <RouterSwitch base={base} id="parent" ref={autoAnimate}>
        <header></header>
        <RouterCase
          path="/[id]"
          cache
          load={async function* ({ id }) {
            const { results } = await getAll();
            return (
              <div class="grid scroll">
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
          cache
          layer
          load={async function* (props, { layer }) {
            const pokemon = await getById(props.id);
            const id = Number(props.id);
            return (
              <Pokemon layer={layer}>
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
                <RouterSwitch id="sub">
                  <>
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
                  </>
                  <RouterCase
                    path="/"
                    cache
                    load={async function* ({ view }) {
                      return (
                        <div class="content">
                          <strong>Stats:</strong> Lorem ipsum dolor sit amet
                          consectetur adipiscing elit lectus nullam, donec
                          penatibus vehicula orci habitant urna integer posuere,
                          est morbi etiam conubia scelerisque lacinia magna
                          odio. Natoque ornare congue varius aenean potenti
                          nullam placerat pellentesque cursus.
                        </div>
                      );
                    }}
                  />
                  <RouterCase
                    path="/moves"
                    cache
                    load={async function* () {
                      return (
                        <div class="content">
                          <strong>Moves:</strong> Lorem ipsum dolor sit amet
                          consectetur adipiscing elit lectus nullam, donec
                          penatibus vehicula orci habitant urna integer posuere,
                          est morbi etiam conubia scelerisque lacinia magna
                          odio. Natoque ornare congue varius aenean potenti
                          nullam placerat pellentesque cursus.
                        </div>
                      );
                    }}
                  />
                </RouterSwitch>
                <footer class="row">
                  <a class="link-icon" href={`../${id - 1}`}>
                    <Icon.Left />
                  </a>
                  <a class="link-icon" href={`/`}>
                    <Icon.Home />
                  </a>
                  <a class="link-icon" href={`../${id + 1}`}>
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
