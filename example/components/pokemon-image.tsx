import { Props, c, css } from "atomico";

function pokemonImage({ src }: Props<typeof pokemonImage>) {
  return (
    <host shadowDom>
      <img class="absolute blur" src={src} alt="" />
      <div class="absolute circle"></div>
      <img class="raw" src={src} alt="" />
    </host>
  );
}

pokemonImage.props = {
  src: String,
};

pokemonImage.styles = css`
  :host {
    position: relative;
    display: block;
  }
  .absolute {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }
  .circle {
    background: rgba(255, 255, 255, 0.35);
    clip-path: circle(40%);
  }
  .blur {
    filter: blur(100px);
    transform: scale(2);
  }
  .raw {
    width: 100%;
    position: relative;
    filter: drop-shadow(rgba(0, 0, 0, 0.05) 0 30px 60px);
  }
`;

export const PokemonImage = c(pokemonImage);

customElements.define("pokemon-image", PokemonImage);
