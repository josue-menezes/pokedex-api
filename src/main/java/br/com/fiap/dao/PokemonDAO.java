package br.com.fiap.dao;

import br.com.fiap.to.PokemonTO;

import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

public class PokemonDAO {

    // Converte uma linha da tabela em um objeto PokemonTO
    private PokemonTO montarPokemon(ResultSet rs) throws SQLException {
        PokemonTO pokemon = new PokemonTO();
        pokemon.setCodigo(rs.getLong("codigo"));
        pokemon.setNome(rs.getString("nome"));
        pokemon.setTipo(rs.getString("tipo"));
        pokemon.setNivel(rs.getInt("nivel"));
        pokemon.setPeso(rs.getDouble("peso"));
        pokemon.setDataDaCaptura(rs.getDate("data_da_captura").toLocalDate());
        return pokemon;
    }

    public ArrayList<PokemonTO> findAll() {
        ArrayList<PokemonTO> pokemons = new ArrayList<PokemonTO>();
        String sql = "select * from ddd_pokemons order by codigo";
        try (PreparedStatement ps = ConnectionFactory.getConnection().prepareStatement(sql)) {
            ResultSet rs = ps.executeQuery();
            if (rs != null) {
                while (rs.next()) {
                    pokemons.add(montarPokemon(rs));
                }
            } else {
                return null;
            }
        } catch (SQLException e) {
            System.out.println("Erro na consulta: " + e.getMessage());
        } finally {
            ConnectionFactory.closeConnection();
        }
        return pokemons;
    }

    public PokemonTO findByCodigo(Long codigo) {
        String sql = "select * from ddd_pokemons where codigo = ?";
        try (PreparedStatement ps = ConnectionFactory.getConnection().prepareStatement(sql)) {
            ps.setLong(1, codigo);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                return montarPokemon(rs);
            } else {
                return null;
            }
        } catch (SQLException e) {
            System.out.println("Erro na consulta: " + e.getMessage());
        } finally {
            ConnectionFactory.closeConnection();
        }
        return null;
    }

    public PokemonTO save(PokemonTO pokemon) {
        String sql = "insert into ddd_pokemons (nome, tipo, nivel, peso, data_da_captura) values(?, ?, ?, ?, ?)";
        // new String[]{"codigo"} -> pede ao Oracle o código gerado automaticamente (IDENTITY)
        try (PreparedStatement ps = ConnectionFactory.getConnection().prepareStatement(sql, new String[]{"codigo"})) {
            ps.setString(1, pokemon.getNome());
            ps.setString(2, pokemon.getTipo());
            ps.setInt(3, pokemon.getNivel());
            ps.setDouble(4, pokemon.getPeso());
            ps.setDate(5, Date.valueOf(pokemon.getDataDaCaptura()));
            if (ps.executeUpdate() > 0) {
                ResultSet chaves = ps.getGeneratedKeys();
                if (chaves.next()) {
                    pokemon.setCodigo(chaves.getLong(1));
                }
                return pokemon;
            } else {
                return null;
            }
        } catch (SQLException e) {
            System.out.println("Erro ao salvar: " + e.getMessage());
        } finally {
            ConnectionFactory.closeConnection();
        }
        return null;
    }

    public PokemonTO update(PokemonTO pokemon) {
        String sql = "update ddd_pokemons set nome=?, tipo=?, nivel=?, peso=?, data_da_captura=? where codigo=?";
        try (PreparedStatement ps = ConnectionFactory.getConnection().prepareStatement(sql)) {
            ps.setString(1, pokemon.getNome());
            ps.setString(2, pokemon.getTipo());
            ps.setInt(3, pokemon.getNivel());
            ps.setDouble(4, pokemon.getPeso());
            ps.setDate(5, Date.valueOf(pokemon.getDataDaCaptura()));
            ps.setLong(6, pokemon.getCodigo());
            if (ps.executeUpdate() > 0) {
                return pokemon;
            } else {
                return null;
            }
        } catch (SQLException e) {
            System.out.println("Erro ao atualizar: " + e.getMessage());
        } finally {
            ConnectionFactory.closeConnection();
        }
        return null;
    }

    public boolean delete(Long codigo) {
        String sql = "delete from ddd_pokemons where codigo = ?";
        try (PreparedStatement ps = ConnectionFactory.getConnection().prepareStatement(sql)) {
            ps.setLong(1, codigo);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            System.out.println("Erro ao excluir: " + e.getMessage());
        } finally {
            ConnectionFactory.closeConnection();
        }
        return false;
    }
}
