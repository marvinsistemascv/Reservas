package marvin.Reservas.util;

import java.text.ParseException;
import java.util.Base64;

/**
 *
 * @author Gustavo Matos
 */

public class Cripto {

    public Cripto() {
    }

    public static String criptografiaBase64Encoder(String pValor) {
        return new String(Base64.getEncoder().encode(pValor.getBytes()));
    }

    public static String descriptografiaBase64Decode(String pValor) {
        return new String(Base64.getDecoder().decode(pValor.getBytes()));
    }

    public static void main(String[] args) throws ParseException {

        // System.out.println(descriptografiaBase64Decode("YU5BSEkyMDA2Kg=="));
        // System.out.println(criptografiaBase64Encoder("não foi dessa vez espertão"));

    }

}