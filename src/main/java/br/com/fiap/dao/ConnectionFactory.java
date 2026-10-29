package br.com.fiap.dao;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * Fábrica de conexões com o Oracle (padrões Factory e Singleton).
 * As credenciais vêm de variáveis de ambiente (DB_URL, DB_USER e DB_PASSWORD):
 * a senha não fica salva no código (nem no GitHub) e o Render consegue configurá-las.
 */
public class ConnectionFactory {

    private static Connection connection;

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

            // Busca dados de conexão nas variáveis de ambiente
            String url = System.getenv("DB_URL");
            String user = System.getenv("DB_USER");
            String password = System.getenv("DB_PASSWORD");

            // Se DB_URL não foi definida, usa o servidor Oracle da FIAP
            if (url == null || url.isBlank()) {
                url = "jdbc:oracle:thin:@oracle.fiap.com.br:1521:ORCL";
            }

            if (user == null || password == null) {
                throw new RuntimeException("Variáveis de ambiente do banco não configuradas!");
            }

            connection = DriverManager.getConnection(url, user, password);
        } catch (SQLException e) {
            System.out.println("Erro de SQL: " + e.getMessage());
        } catch (ClassNotFoundException e) {
            System.out.println("Erro nome da classe: " + e.getMessage());
        }
        return connection;
    }
}
