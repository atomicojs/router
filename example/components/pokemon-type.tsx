import { Props, c, css } from "atomico";

function pokemonType({ type }: Props<typeof pokemonType>) {
  return <host shadowDom>{type}</host>;
}

pokemonType.props = {
  type: {
    type: String,
    reflect: true,
  },
};

pokemonType.styles = css`
  :host {
    display: inline-flex;
    padding: 0.25rem 0.5rem;
    font-size: 0.75em;
    text-transform: capitalize;
    background: var(--bgcolor, #bdbdbd);
    border-radius: 100px;
    font-weight: bold;
  }
  :host([type="bug"]) {
    --bgcolor: #c8a6f1;
  }
  :host([type="grass"]) {
    --bgcolor: #7cdf7d;
  }
  :host([type="poison"]) {
    --bgcolor: #fb89c7;
  }
  :host([type="normal"]) {
    --bgcolor: #eddf86;
  }
  :host([type="water"]) {
    --bgcolor: #9ddde9;
  }
  :host([type="fighting"]) {
    --bgcolor: #ffb370;
  }
  :host([type="fire"]) {
    --bgcolor: #ff8a6a;
  }
  :host([type="psychic"]) {
    --bgcolor: #d5c9ff;
  }
  :host([type="ground"]) {
    --bgcolor: #ddcca2;
  }
  :host([type="electric"]) {
    --bgcolor: #e1e18c;
  }
`;

export const PokemonType = c(pokemonType);

customElements.define("pokemon-type", PokemonType);
