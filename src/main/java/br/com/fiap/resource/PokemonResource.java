package br.com.fiap.resource;

import br.com.fiap.bo.PokemonBO;
import br.com.fiap.to.PokemonTO;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;

@RestController
@RequestMapping("/pokedex")
public class PokemonResource {

    private final PokemonBO pokemonBO = new PokemonBO();

    // GET /pokedex -> lista todos (200 OK / 404 NOT FOUND)
    @GetMapping
    public ResponseEntity<?> findAll() {
        ArrayList<PokemonTO> resultado = pokemonBO.findAll();
        if (resultado != null) {
            return ResponseEntity.status(HttpStatus.OK).body(resultado);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    // GET /pokedex/{codigo} -> busca um (200 OK / 404 NOT FOUND)
    @GetMapping("/{codigo}")
    public ResponseEntity<?> findByCodigo(@PathVariable Long codigo) {
        PokemonTO pokemon = pokemonBO.findByCodigo(codigo);
        if (pokemon != null) {
            return ResponseEntity.status(HttpStatus.OK).body(pokemon);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Pokémon não encontrado!");
        }
    }

    // POST /pokedex -> cadastra (201 CREATED / 400 BAD REQUEST)
    @PostMapping
    public ResponseEntity<?> save(@RequestBody @Valid PokemonTO pokemon) {
        PokemonTO resultado = pokemonBO.save(pokemon);
        if (resultado != null) {
            return ResponseEntity.status(HttpStatus.CREATED).body(resultado);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Erro ao salvar pokémon");
        }
    }

    // PUT /pokedex/{codigo} -> atualiza (201 CREATED / 400 BAD REQUEST)
    @PutMapping("/{codigo}")
    public ResponseEntity<?> update(@PathVariable Long codigo,
                                    @RequestBody @Valid PokemonTO pokemon) {
        pokemon.setCodigo(codigo);
        PokemonTO resultado = pokemonBO.update(pokemon);
        if (resultado != null) {
            return ResponseEntity.status(HttpStatus.CREATED).body(resultado);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Erro ao atualizar pokémon");
        }
    }

    // DELETE /pokedex/{codigo} -> exclui (204 NO CONTENT / 404 NOT FOUND)
    @DeleteMapping("/{codigo}")
    public ResponseEntity<String> delete(@PathVariable Long codigo) {
        if (pokemonBO.delete(codigo)) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body("Pokémon deletado com sucesso!");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Pokémon não encontrado!");
        }
    }
}
