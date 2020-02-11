1. Keskustelunäkymän muuttaminen käyttökelpoiseksi
    - viestit päällekkäin DONE
    - kommenttikenttä fixed ruudun alareunassa DONE
    - kommenttikenttä ei mene viestien päälle, vaan viestit rullautuvat sen yläpuolella MELKEIN DONE
    - näkyviin viestien lähettäjän nimi DONE
        - viestit objektina {name: String, text: String, date}
    - kauniimmat viestit (nimi ja viesti selvästi erillään)
    - keskustelun osaanottajat näkyvissä esim vasemmassa laidassa
2. Kirjautuminen
    - käyttäjä voi kirjautua
    - voi luoda käyttäjän
    - voi muuttaa tietojaan
    - voi poistaa käyttäjän
3. Fullstack muutos viestien ja kuvien irrottamiseen keskusteluista
    - erillinen taulu kuville, erillinen taulu viesteille
        -  kuviin keskustelun id, jotta voi hakea
        -  viesteihin keskustelun id, jotta voi hakea
    - taulujen indeksöinti 
    - tällöin voi myös luoda kuvattomia näkymiä, jotta ei täydy ladata 200mb kuvia, jotta saa keskustelut listattua
    - eikä tarvi ladata viestejä pelkästään conversation listin takia
4. Väriskaalan muutos
    - Tumma sävy defaulttina
    - nappula, joka sallii sävymuutoksen vaalean ja tumman sävyn välillä
        - reduxin käyttöönotto sitä varten mahdollisesti
5. Ulkoasun muutos
<<<<<<< HEAD
    - melko ruma atm
=======
    - etenkin carousel on melko ruma :((
>>>>>>> 20eb3bb5d3cc9ef9fc00fc2e3981cc891d3a2c69
