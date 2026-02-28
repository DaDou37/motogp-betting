using MotogpApi.Models;

namespace MotogpApi.Data
{
    public static class GrandsPrixSeeder
    {
        public static void Seed(AppDbContext context)
        {
            if (context.GrandsPrix.Any()) return;

            DateTime Utc(int year, int month, int day) =>
                DateTime.SpecifyKind(new DateTime(year, month, day), DateTimeKind.Utc);

            var grandsPrix = new List<GrandPrix>
            {
                new GrandPrix { Nom = "PT Grand Prix of Thailand", Circuit = "Chang International Circuit", Pays = "Thaïlande", DateCourse = Utc(2026, 3, 1), EstTermine = false },
                new GrandPrix { Nom = "Estrella Galicia 0,0 Grand Prix of Brazil", Circuit = "Autodromo de Interlagos", Pays = "Brésil", DateCourse = Utc(2026, 3, 22), EstTermine = false },
                new GrandPrix { Nom = "Red Bull Grand Prix of The United States", Circuit = "Circuit of The Americas", Pays = "USA", DateCourse = Utc(2026, 3, 29), EstTermine = false },
                new GrandPrix { Nom = "Qatar Airways Grand Prix of Qatar", Circuit = "Lusail International Circuit", Pays = "Qatar", DateCourse = Utc(2026, 4, 12), EstTermine = false },
                new GrandPrix { Nom = "Estrella Galicia 0,0 Grand Prix of Spain", Circuit = "Circuit de Jerez", Pays = "Espagne", DateCourse = Utc(2026, 4, 26), EstTermine = false },
                new GrandPrix { Nom = "Michelin Grand Prix of France", Circuit = "Circuit Bugatti Le Mans", Pays = "France", DateCourse = Utc(2026, 5, 10), EstTermine = false },
                new GrandPrix { Nom = "Monster Energy Grand Prix of Catalunya", Circuit = "Circuit de Barcelona-Catalunya", Pays = "Espagne", DateCourse = Utc(2026, 5, 17), EstTermine = false },
                new GrandPrix { Nom = "Brembo Grand Prix of Italy", Circuit = "Autodromo del Mugello", Pays = "Italie", DateCourse = Utc(2026, 5, 31), EstTermine = false },
                new GrandPrix { Nom = "Grand Prix of Hungary", Circuit = "Balaton Park Circuit", Pays = "Hongrie", DateCourse = Utc(2026, 6, 7), EstTermine = false },
                new GrandPrix { Nom = "Grand Prix of Czechia", Circuit = "Automotodrom Brno", Pays = "Tchéquie", DateCourse = Utc(2026, 6, 21), EstTermine = false },
                new GrandPrix { Nom = "Grand Prix of The Netherlands", Circuit = "TT Circuit Assen", Pays = "Pays-Bas", DateCourse = Utc(2026, 6, 28), EstTermine = false },
                new GrandPrix { Nom = "Liqui Moly Grand Prix of Germany", Circuit = "Sachsenring", Pays = "Allemagne", DateCourse = Utc(2026, 7, 12), EstTermine = false },
                new GrandPrix { Nom = "Qatar Airways Grand Prix of Great Britain", Circuit = "Silverstone Circuit", Pays = "Royaume-Uni", DateCourse = Utc(2026, 8, 9), EstTermine = false },
                new GrandPrix { Nom = "Grand Prix of Aragon", Circuit = "MotorLand Aragon", Pays = "Espagne", DateCourse = Utc(2026, 8, 30), EstTermine = false },
                new GrandPrix { Nom = "Red Bull Grand Prix of San Marino", Circuit = "Misano World Circuit", Pays = "Italie", DateCourse = Utc(2026, 9, 13), EstTermine = false },
                new GrandPrix { Nom = "Grand Prix of Austria", Circuit = "Red Bull Ring", Pays = "Autriche", DateCourse = Utc(2026, 9, 20), EstTermine = false },
                new GrandPrix { Nom = "Motul Grand Prix of Japan", Circuit = "Twin Ring Motegi", Pays = "Japon", DateCourse = Utc(2026, 10, 4), EstTermine = false },
                new GrandPrix { Nom = "Pertamina Grand Prix of Indonesia", Circuit = "Mandalika Street Circuit", Pays = "Indonésie", DateCourse = Utc(2026, 10, 11), EstTermine = false },
                new GrandPrix { Nom = "Grand Prix of Australia", Circuit = "Phillip Island Circuit", Pays = "Australie", DateCourse = Utc(2026, 10, 25), EstTermine = false },
                new GrandPrix { Nom = "Petronas Grand Prix of Malaysia", Circuit = "Sepang International Circuit", Pays = "Malaisie", DateCourse = Utc(2026, 11, 1), EstTermine = false },
                new GrandPrix { Nom = "Repsol Grand Prix of Portugal", Circuit = "Autodromo do Algarve", Pays = "Portugal", DateCourse = Utc(2026, 11, 15), EstTermine = false },
                new GrandPrix { Nom = "Motul Grand Prix of Valencia", Circuit = "Circuit Ricardo Tormo", Pays = "Espagne", DateCourse = Utc(2026, 11, 22), EstTermine = false },
            };

            context.GrandsPrix.AddRange(grandsPrix);
            context.SaveChanges();
        }
    }
}