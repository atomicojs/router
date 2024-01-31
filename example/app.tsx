import { RouterCase, RouterSwitch } from "../src/router";
import { getById } from "./api";
import { Pokemon } from "./components/pokemon";
import { PokemonTabs } from "./components/pokemon-tabs";
import { PokemonImage } from "./components/pokemon-image";

export default ({ base }: { base: string }) => (
  <host>
    <RouterSwitch base={base} id="parent">
      <header></header>
      <RouterCase path="/" cache load={async function* () {}} />
      <RouterCase
        path="/pokemon/{id}/[view]"
        cache
        load={async function* (props) {
          const pokemon = await getById(props.id);
          const id = Number(props.id);
          return (
            <Pokemon>
              <PokemonImage
                slot="image"
                src={pokemon.sprites.other.home.front_default}
              ></PokemonImage>
              <h1>{pokemon.name}</h1>
              <RouterSwitch>
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
                    return "Stats";
                  }}
                />
                <RouterCase
                  path="/moves"
                  cache
                  load={async function* () {
                    pokemon.moves.map(() => {});
                    return "Moves";
                  }}
                />
              </RouterSwitch>
              <footer>
                <a href={`../${id - 1}`}>Prev</a>
                <a href={`/`}>Home</a>
                <a href={`../${id + 1}`}>Next</a>
              </footer>
            </Pokemon>
          );
        }}
      />
    </RouterSwitch>
  </host>
);
