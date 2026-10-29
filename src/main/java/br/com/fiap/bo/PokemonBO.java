package br.com.fiap.bo;

import br.com.fiap.dao.PokemonDAO;
import br.com.fiap.to.PokemonTO;

import java.time.LocalDate;
import java.util.ArrayList;

public class PokemonBO {

    private PokemonDAO pokemonDAO;

    public ArrayList<PokemonTO> findAll() {
        pokemonDAO = new PokemonDAO();
        // aqui se implementa a regra de negócios
        return pokemonDAO.findAll();
    }

    public PokemonTO findByCodigo(Long codigo) {
        pokemonDAO = new PokemonDAO();
        // aqui se implementa a regra de negócios
        return pokemonDAO.findByCodigo(codigo);
    }

    public PokemonTO save(PokemonTO pokemon) {
        pokemonDAO = new PokemonDAO();
        // regra de negócio: a data da captura deve ser uma data no passado
        // (não dá para ter capturado um pokémon no futuro)
        if (pokemon.getDataDaCaptura().isAfter(LocalDate.now())) {
            return null;
        }
        return pokemonDAO.save(pokemon);
    }

    public PokemonTO update(PokemonTO pokemon) {
        pokemonDAO = new PokemonDAO();
        // mesma regra de negócio do cadastro
        if (pokemon.getDataDaCaptura().isAfter(LocalDate.now())) {
            return null;
        }
        return pokemonDAO.update(pokemon);
    }

    public boolean delete(Long codigo) {
        pokemonDAO = new PokemonDAO();
        // aqui se implementa a regra de negócios
        return pokemonDAO.delete(codigo);
    }
}
