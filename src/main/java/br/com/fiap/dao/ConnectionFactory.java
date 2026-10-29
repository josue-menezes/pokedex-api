package br.com.fiap.dao;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * Fábrica de conexões com o Oracle (padrões Factory e Singleton).
 * Usuário e senha vêm de variáveis de ambiente (DB_USER e DB_PASSWORD),
 * assim a senha não fica exposta no GitHub e o deploy consegue configurá-las.
 */
public class ConnectionFactory {

    private static Connection connection;

    private static String env(String nome, String padrao) {
        String valor = System.getenv(nome);
        return (valor == null || valor.isBlank()) ? padrao : valor;
    }

    public static void closeConnection() {
        try {
            if (connection != null && !connection.isClosed()) {
                connection.close();
            }
        } catch (Exception e) {
            System.out.println("Erro: " + e.getMessage());
        }
    }

    public static Connection getConnection() {
        try {
            if (connection != null && !connection.isClosed()) {
                return connection;
            }
            Class.forName("oracle.jdbc.driver.OracleDriver");
            String url = env("DB_URL", "jdbc:oracle:thin:@oracle.fiap.com.br:1521:ORCL");
            String user = env("DB_USER", "seu usuário");
            String password = env("DB_PASSWORD", "sua senha");
            connection = DriverManager.getConnection(url, user, password);
        } catch (SQLException e) {
            System.out.println("Erro de SQL: " + e.getMessage());
        } catch (ClassNotFoundException e) {
            System.out.println("Erro nome da classe: " + e.getMessage());
        }
        return connection;
    }
}
