Działasz jako doświadczony Frontend Senior Developer i ekspert od Clean Architecture we frontendzie (Feature-Driven Architecture). Moim celem jest refaktoryzacja kodu oraz reorganizacja struktury folderów w tym repozytorium React 19, aby projekt był maksymalnie czytelny, skalowalny i zgodny z nowoczesnymi standardami, przy zachowaniu pełnej dotychczasowej funkcjonalności.

Przeanalizuj pliki w projekcie i pomóż mi je poprawić oraz przeorganizować według następujących wytycznych:

1. Nowa Architektura Folderów (Clean/Feature-Driven): Chcę zmienić strukturę katalogów na bardziej modularną. Przemodeluj strukturę src/ tak, aby komponenty, hoki i logika były pogrupowane wokół konkretnych funkcji (features). Propozycja nowej struktury, która pasuje do naszego README:
   src/
   ├── api/             # Globalna konfiguracja klientów API (Axios, interceptory)
   ├── components/      # Globalne, reużywalne elementy UI (Button, Input, Navbar)
   ├── context/         # Globalne stany (np. AuthContext)
   ├── features/        # Moduły funkcjonalne (pionowe wycinki aplikacji)
   │   ├── auth/        # Komponenty, hooki, api powiązane tylko z logowaniem/rejestracją
   │   ├── calories/    # Monitorowanie kalorii (widoki, wykresy, formularze wpisów)
   │   └── exercises/   # Logowanie ćwiczeń
   └── pages/           # Główne punkty wejścia dla React Router (składają ekrany z gotowych features)

2. Nienaruszalność konfiguracji: Wszystkie obecne endpointy (do AuthAPI, ExerciseAPI, BackendLogicApi), bazowe klucze i logika działania muszą pozostać nietknięte. Po zmianie ścieżek importów aplikacja musi działać dokładnie tak samo.
3. Czytelność kodu: Podziel długie komponenty na mniejsze, popraw nazewnictwo na bardziej intuicyjne, wydziel powtarzalną logikę do dedykowanych custom hooków wewnątrz modułów feature.
4. Bezpieczeństwo i .env: Jeśli w kodzie (szczególnie w warstwie api) znajdują się zahardkodowane adresy URL do API lub inne wrażliwe dane, nie usuwaj ich drastycznie. Zostaw je, ale dodaj obok wyraźny komentarz:
   // TODO: [DO ZABEZPIECZENIA] - Przenieść ten element do pliku .env
5. Komentarze: Usuń stary, zakomentowany kod, a w trudniejszych miejscach zostaw krótkie wyjaśnienia "dlaczego".

Przeanalizuj obecny stan projektu. Zaproponuj mapowanie obecnych plików na nową strukturę i powiedz, od którego pliku/modułu zaczynamy refaktoryzację.