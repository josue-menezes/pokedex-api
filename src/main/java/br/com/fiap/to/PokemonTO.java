package br.com.fiap.to;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public class PokemonTO {
    private Long codigo;

    @NotBlank(message = "O nome é obrigatório")
    @Size(max = 100, message = "O nome deve ter no máximo 100 caracteres")
    private String nome;

    @NotBlank(message = "O tipo é obrigatório")
    @Size(max = 50, message = "O tipo deve ter no máximo 50 caracteres")
    private String tipo;

    @NotNull(message = "O nível é obrigatório")
    @Min(value = 1, message = "O nível mínimo é 1")
    @Max(value = 100, message = "O nível máximo é 100")
    private Integer nivel;

    @NotNull(message = "O peso é obrigatório")
    @Positive(message = "O peso deve ser maior que zero")
    private Double peso;

    @NotNull(message = "A data da captura é obrigatória")
    @PastOrPresent(message = "A data da captura não pode ser no futuro")
    private LocalDate dataDaCaptura;

    public PokemonTO() {
    }

    public PokemonTO(Long codigo, String nome, String tipo, Integer nivel, Double peso, LocalDate dataDaCaptura) {
        this.codigo = codigo;
        this.nome = nome;
        this.tipo = tipo;
        this.nivel = nivel;
        this.peso = peso;
        this.dataDaCaptura = dataDaCaptura;
    }

    public Long getCodigo() {
        return codigo;
    }

    public void setCodigo(Long codigo) {
        this.codigo = codigo;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public Integer getNivel() {
        return nivel;
    }

    public void setNivel(Integer nivel) {
        this.nivel = nivel;
    }

    public Double getPeso() {
        return peso;
    }

    public void setPeso(Double peso) {
        this.peso = peso;
    }

    public LocalDate getDataDaCaptura() {
        return dataDaCaptura;
    }

    public void setDataDaCaptura(LocalDate dataDaCaptura) {
        this.dataDaCaptura = dataDaCaptura;
    }
}
