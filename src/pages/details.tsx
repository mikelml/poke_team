import PokemonTeamList from "../components/pokemonTeamList/pokemonTeamList";

import "../App.css";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { doRequest } from "../services/ApiBase";
import { useAppContext } from "../context/appContext";
import ACTIONS from "../context/appActions";
import { IPokemon } from "../types/types";
import "./details.styl";
function Details() {
  const { id } = useParams();
  const [pokemon, setPokemon] = useState({});
  const {
    dispatch,
    store: { pokemonTeam },
  } = useAppContext();

  useEffect(() => {
    doRequest(`pokemon/${id}`).then((item) => {
      setPokemon({
        id: item?.id,
        img: item?.sprites?.front_default,
        name: item.species.name,
        number: item.order,
        height: item.height,
        type: item.types[0]?.type.name,
        stast: item.stats,
      });
    });
  }, [id]);

  const addPokemon = (item: IPokemon) => {
    doRequest(`pokemon/${item.name}`).then((pokemon: object) => {
      dispatch({
        type: ACTIONS.UPDATE_STATE,
        data: {
          pokemonTeam: [
            ...pokemonTeam,
            {
              id: pokemon?.id,
              img: pokemon?.sprites?.front_default,
              name: pokemon.species.name,
              number: pokemon.order,
              height: pokemon.height,
              type: item.types[0]?.type.name,
              stast: pokemon.stats,
            },
          ],
        },
      });
    });
  };

  const removePokemon = (item: IPokemon) => {
    const pokemonIndex = pokemonTeam.findIndex(
      (pokemon) => pokemon.id === item.id
    );
    const newPokemonTeam = pokemonTeam.splice(pokemonIndex, 1);

    dispatch({
      type: ACTIONS.UPDATE_STATE,
      data: newPokemonTeam,
    });
  };

  const isContained = () => {
    for (let i = 0; i < pokemonTeam.length; i++) {
      if (pokemon.id === pokemonTeam[i].id) return true;
    }
    return false;
  };
  return (
    <>
      <div className="pokemon-details-container">
        <div className="navbar">
          <Link to="/">volver</Link>
          {isContained() ? (
            <button onClick={() => removePokemon(pokemon)}>
              eliminar de la lista
            </button>
          ) : (
            <button onClick={() => addPokemon(pokemon)}>
              agregar a la lista
            </button>
          )}
        </div>
        <div className="pokemon-details">
          <img src={pokemon.img} />
          <div>
            <div>Name: {pokemon.name}</div>
            <div>Pokedex #: {pokemon.number}</div>
            <div>Height: {pokemon.height}</div>
            <div>Type: {pokemon.type}</div>
          </div>
        </div>
      </div>
      <PokemonTeamList></PokemonTeamList>
    </>
  );
}

export default Details;
