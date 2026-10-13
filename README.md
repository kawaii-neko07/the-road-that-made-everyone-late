# The Road That Made Everyone Late

Interaktywny symulator paradoksu Braessa, bez zależności. Interfejs po polsku.

## Uruchomienie

Wymagane Python 3 do serwowania plików i Node.js 18+ do testów.

```sh
npm start
# http://localhost:8080
npm test
```

Można też hostować katalog `dist` na GitHub Pages. Importy modułów wymagają HTTP; nie otwieraj index.html przez file://.

## Odkrywanie paradoksu

Porównanie wariantów i wspólny plan pojawiają się po pierwszym otwarciu skrótu. Reset przywraca początek eksperymentu. Ruch znaczników obrazuje kierunek i względny przepływ, nie pojedyncze auta ani prędkość. Można go zatrzymać; aplikacja respektuje prefers-reduced-motion. Na małych ekranach mapa jest przesuwana w poziomie, a tekstowe zestawienie poniżej podaje czasy i przepływy wszystkich dróg.

## Eksperyment

Cztery węzły S, A, B, T. Pięć skierowanych dróg: S→A, A→T, S→B, B→T i opcjonalna A→B. Regulacja popytu, otwarcie/zamknięcie skrótu, wybór równowagi lub optimum, parametry afinicznych kosztów, przepływy, czasy tras, porównanie obu sieci i eksport JSON.

Klasyczna konfiguracja: 4000 poj./h; S→A i B→T kosztują x/100 minut, pozostałe zewnętrzne drogi 45 minut, skrót 0 minut. Równowaga bez skrótu: 2000 poj./h każdą trasą i 65 minut. Po otwarciu skrótu: 4000 poj./h przez S→A→B→T i 80 minut. Usunięcie drogi oszczędza 15 minut na podróż. Optimum z otwartym skrótem: 1750, 1750 i 500 poj./h; średnio 64,6875 minuty.

## Obliczenia

`dist/solver.js` enumeruje proste ścieżki grafu przez DFS. Koszt drogi e wynosi a_e x_e + b_e. Równowaga Wardropa minimalizuje potencjał Beckmanna Σ_e(a_e x_e²/2 + b_e x_e). Optimum społeczne minimalizuje łączny czas Σ_e(a_e x_e² + b_e x_e). Oba są wypukłymi zadaniami kwadratowymi przy nieujemnych przepływach ścieżek i sumie równej popytowi.

Solver enumeruje wszystkie niepuste aktywne zbiory ścieżek i rozwiązuje układ KKT eliminacją Gaussa. Odrzuca ujemne przepływy, wybiera najniższą wartość celu. Przy osobliwych układach optimum reprezentowane jest również na niżej wymiarowej ścianie. To obliczenia dla dowolnych parametrów modelu, nie zapisany scenariusz. Luka Wardropa to średnia ważona różnica między czasem wybranej ścieżki a najlepszą dostępną.

Model jest ciągły i nieatomowy: pojedynczy użytkownik ma pomijalny wpływ na przepływ. Ułamkowe pojazdy/h są poprawne. Model nie obejmuje kolejek, przepustowości ani dynamiki czasowej. Optimum społeczne wymaga koordynacji. Graf jest skierowany, skrót A→B. Enumeracja aktywnych zbiorów ma złożoność wykładniczą w liczbie ścieżek; solver przeznaczony do niewielkiego MVP, nie dużych sieci.

## Walidacja

Test klasycznego paradoksu i wartości optimum. 378 konfiguracji parametrów i stanów skrótu sprawdzają zachowanie popytu, nieujemność, warunek Wardropa, przewagę optimum nad równowagą i brak pogorszenia optimum po dodaniu drogi. Dodatkowo zerowe koszty i osobliwe przypadki stałych kosztów.

## Struktura

- `dist/index.html`, `style.css`, `app.js`: dostępny, responsywny interfejs.
- `dist/solver.js`: niezależny model obliczeniowy.
- `tests/solver.test.js`: testy Node.js.

Rozbudowa: edytor grafu, walidowane funkcje nieliniowe, skalowalny solver i serie scenariuszy.
