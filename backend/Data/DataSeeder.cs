using MotogpApi.Models;

namespace MotogpApi.Data
{
    public static class DataSeeder
    {
        public static void Seed(AppDbContext context)
        {
            var pilotesData = new List<Pilote>
            {
                new Pilote { Nom = "Bezzecchi", Prenom = "Marco", Nationalite = "Italien", Numero = 72, Equipe = "Aprilia Racing",
                    PhotoUrl = "" },
                new Pilote { Nom = "Martin", Prenom = "Jorge", Nationalite = "Espagnol", Numero = 89, Equipe = "Aprilia Racing",
                    PhotoUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Jorge_Martin_2024_Qatar.jpg/440px-Jorge_Martin_2024_Qatar.jpg" },
                new Pilote { Nom = "Aldeguer", Prenom = "Fermin", Nationalite = "Espagnol", Numero = 54, Equipe = "BK8 Gresini Racing MotoGP",
                    PhotoUrl = "" },
                new Pilote { Nom = "Marquez", Prenom = "Alex", Nationalite = "Espagnol", Numero = 73, Equipe = "BK8 Gresini Racing MotoGP",
                    PhotoUrl = "" },
                new Pilote { Nom = "Bagnaia", Prenom = "Francesco", Nationalite = "Italien", Numero = 1, Equipe = "Ducati Lenovo Team",
                    PhotoUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Francesco_Bagnaia_2023_Qatar.jpg/440px-Francesco_Bagnaia_2023_Qatar.jpg" },
                new Pilote { Nom = "Marquez", Prenom = "Marc", Nationalite = "Espagnol", Numero = 93, Equipe = "Ducati Lenovo Team",
                    PhotoUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Marc_M%C3%A1rquez_2019_Qatar.jpg/440px-Marc_M%C3%A1rquez_2019_Qatar.jpg" },
                new Pilote { Nom = "Marini", Prenom = "Luca", Nationalite = "Italien", Numero = 10, Equipe = "Honda HRC Castrol",
                    PhotoUrl = "" },
                new Pilote { Nom = "Mir", Prenom = "Joan", Nationalite = "Espagnol", Numero = 36, Equipe = "Honda HRC Castrol",
                    PhotoUrl = "" },
                new Pilote { Nom = "Zarco", Prenom = "Johann", Nationalite = "Français", Numero = 5, Equipe = "LCR Honda",
                    PhotoUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Johann_Zarco_2023.jpg/440px-Johann_Zarco_2023.jpg" },
                new Pilote { Nom = "Moreira", Prenom = "Diogo", Nationalite = "Brésilien", Numero = 21, Equipe = "LCR Honda",
                    PhotoUrl = "" },
                new Pilote { Nom = "Quartararo", Prenom = "Fabio", Nationalite = "Français", Numero = 20, Equipe = "Monster Energy Yamaha MotoGP",
                    PhotoUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Fabio_Quartararo_2021_Qatar.jpg/440px-Fabio_Quartararo_2021_Qatar.jpg" },
                new Pilote { Nom = "Rins", Prenom = "Alex", Nationalite = "Espagnol", Numero = 42, Equipe = "Monster Energy Yamaha MotoGP",
                    PhotoUrl = "" },
                new Pilote { Nom = "Morbidelli", Prenom = "Franco", Nationalite = "Italien", Numero = 21, Equipe = "Pertamina Enduro VR46 Racing Team",
                    PhotoUrl = "" },
                new Pilote { Nom = "Di Giannantonio", Prenom = "Fabio", Nationalite = "Italien", Numero = 49, Equipe = "Pertamina Enduro VR46 Racing Team",
                    PhotoUrl = "" },
                new Pilote { Nom = "Razgatlioglu", Prenom = "Toprak", Nationalite = "Turc", Numero = 54, Equipe = "Prima Pramac Yamaha MotoGP",
                    PhotoUrl = "" },
                new Pilote { Nom = "Miller", Prenom = "Jack", Nationalite = "Australien", Numero = 43, Equipe = "Prima Pramac Yamaha MotoGP",
                    PhotoUrl = "" },
                new Pilote { Nom = "Binder", Prenom = "Brad", Nationalite = "Sud-Africain", Numero = 33, Equipe = "Red Bull KTM Factory Racing",
                    PhotoUrl = "" },
                new Pilote { Nom = "Acosta", Prenom = "Pedro", Nationalite = "Espagnol", Numero = 31, Equipe = "Red Bull KTM Factory Racing",
                    PhotoUrl = "" },
                new Pilote { Nom = "Viñales", Prenom = "Maverick", Nationalite = "Espagnol", Numero = 12, Equipe = "Red Bull KTM Tech3",
                    PhotoUrl = "" },
                new Pilote { Nom = "Bastianini", Prenom = "Enea", Nationalite = "Italien", Numero = 23, Equipe = "Red Bull KTM Tech3",
                    PhotoUrl = "" },
                new Pilote { Nom = "Fernandez", Prenom = "Raul", Nationalite = "Espagnol", Numero = 25, Equipe = "Trackhouse MotoGP Team",
                    PhotoUrl = "" },
                new Pilote { Nom = "Ogura", Prenom = "Ai", Nationalite = "Japonais", Numero = 79, Equipe = "Trackhouse MotoGP Team",
                    PhotoUrl = "" },
            };

            // Si pas de pilotes, on les crée
            if (!context.Pilotes.Any())
            {
                context.Pilotes.AddRange(pilotesData);
                context.SaveChanges();
                return;
            }

            // Sinon on met à jour les photos manquantes
            bool hasChanges = false;
            foreach (var data in pilotesData)
            {
                if (string.IsNullOrEmpty(data.PhotoUrl)) continue;

                var pilote = context.Pilotes
                    .FirstOrDefault(p => p.Nom == data.Nom && p.Prenom == data.Prenom);

                if (pilote != null && string.IsNullOrEmpty(pilote.PhotoUrl))
                {
                    pilote.PhotoUrl = data.PhotoUrl;
                    hasChanges = true;
                }
            }

            if (hasChanges) context.SaveChanges();
        }
    }
}