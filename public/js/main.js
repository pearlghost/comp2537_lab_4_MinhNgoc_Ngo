let offset = 0;
let limit = 10;
let loading = false;

const container = document.getElementById("pokemon-container");
const loader = document.getElementById("loader");
const btn = document.getElementById("loadMoreBtn");

async function loadPokemon() {
  loading = true;

  loader.classList.remove("d-none");
  btn.disabled = true;

  const startTime = Date.now();

  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`,
    );

    const json = await response.json();

    for (let pokemon of json.results) {
      const res = await fetch(pokemon.url);
      const data = await res.json();

      const sprite = data.sprites.other["official-artwork"].front_default;

      container.innerHTML += `
            <div class="col-md-4">
                <div class="card h-100 shadow pokemon-card">
                    <div class="pokemon-img-wrapper">
                        <img src="${sprite}" class="card-img-top p-3">

                        <div class="pokemon-stats">
                            <p><strong>HP:</strong> ${data.stats[0].base_stat}</p>
                            <p><strong>Attack:</strong> ${data.stats[1].base_stat}</p>
                            <p><strong>Defense:</strong> ${data.stats[2].base_stat}</p>
                            <p><strong>Speed:</strong> ${data.stats[5].base_stat}</p>
                        </div>
                    </div>

                    <div class="card-body text-center bg-secondary-subtle">
                        <h5 class="card-title text-capitalize">
                            ${pokemon.name}
                        </h5>
                    </div>
                </div>
            </div>
            `;
    }

    offset += limit;

    const elapsed = Date.now() - startTime;
    const minDelay = 900;

    if (elapsed < minDelay) {
      await new Promise((resolve) => setTimeout(resolve, minDelay - elapsed));
    }
  } catch (err) {
    console.error(err);
  } finally {
    loader.classList.add("d-none");
    btn.disabled = false;
    loading = false;
  }
}

/* ------------------------- */
/* Load More Button Logic */
/* ------------------------- */

btn.addEventListener("click", () => {
  if (!loading) {
    loadPokemon();
  }
});

/* Initial Load */
loadPokemon();
