using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace MotogpApi.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "GrandsPrix",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Nom = table.Column<string>(type: "text", nullable: false),
                    Circuit = table.Column<string>(type: "text", nullable: false),
                    Pays = table.Column<string>(type: "text", nullable: false),
                    DateCourse = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    EstTermine = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GrandsPrix", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Pilotes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Nom = table.Column<string>(type: "text", nullable: false),
                    Prenom = table.Column<string>(type: "text", nullable: false),
                    Nationalite = table.Column<string>(type: "text", nullable: false),
                    Numero = table.Column<int>(type: "integer", nullable: false),
                    Equipe = table.Column<string>(type: "text", nullable: false),
                    PhotoUrl = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Pilotes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Utilisateurs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Pseudo = table.Column<string>(type: "text", nullable: false),
                    Email = table.Column<string>(type: "text", nullable: false),
                    MotDePasse = table.Column<string>(type: "text", nullable: false),
                    Points = table.Column<int>(type: "integer", nullable: false),
                    EstAdmin = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Utilisateurs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Resultats",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Position = table.Column<int>(type: "integer", nullable: false),
                    GrandPrixId = table.Column<int>(type: "integer", nullable: false),
                    PiloteId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Resultats", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Resultats_GrandsPrix_GrandPrixId",
                        column: x => x.GrandPrixId,
                        principalTable: "GrandsPrix",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Resultats_Pilotes_PiloteId",
                        column: x => x.PiloteId,
                        principalTable: "Pilotes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Paris",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    DatePari = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    EstValide = table.Column<bool>(type: "boolean", nullable: false),
                    PointsGagnes = table.Column<int>(type: "integer", nullable: false),
                    UtilisateurId = table.Column<int>(type: "integer", nullable: false),
                    GrandPrixId = table.Column<int>(type: "integer", nullable: false),
                    PiloteP1Id = table.Column<int>(type: "integer", nullable: false),
                    PiloteP2Id = table.Column<int>(type: "integer", nullable: false),
                    PiloteP3Id = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Paris", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Paris_GrandsPrix_GrandPrixId",
                        column: x => x.GrandPrixId,
                        principalTable: "GrandsPrix",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Paris_Pilotes_PiloteP1Id",
                        column: x => x.PiloteP1Id,
                        principalTable: "Pilotes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Paris_Pilotes_PiloteP2Id",
                        column: x => x.PiloteP2Id,
                        principalTable: "Pilotes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Paris_Pilotes_PiloteP3Id",
                        column: x => x.PiloteP3Id,
                        principalTable: "Pilotes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Paris_Utilisateurs_UtilisateurId",
                        column: x => x.UtilisateurId,
                        principalTable: "Utilisateurs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Paris_GrandPrixId",
                table: "Paris",
                column: "GrandPrixId");

            migrationBuilder.CreateIndex(
                name: "IX_Paris_PiloteP1Id",
                table: "Paris",
                column: "PiloteP1Id");

            migrationBuilder.CreateIndex(
                name: "IX_Paris_PiloteP2Id",
                table: "Paris",
                column: "PiloteP2Id");

            migrationBuilder.CreateIndex(
                name: "IX_Paris_PiloteP3Id",
                table: "Paris",
                column: "PiloteP3Id");

            migrationBuilder.CreateIndex(
                name: "IX_Paris_UtilisateurId",
                table: "Paris",
                column: "UtilisateurId");

            migrationBuilder.CreateIndex(
                name: "IX_Resultats_GrandPrixId",
                table: "Resultats",
                column: "GrandPrixId");

            migrationBuilder.CreateIndex(
                name: "IX_Resultats_PiloteId",
                table: "Resultats",
                column: "PiloteId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Paris");

            migrationBuilder.DropTable(
                name: "Resultats");

            migrationBuilder.DropTable(
                name: "Utilisateurs");

            migrationBuilder.DropTable(
                name: "GrandsPrix");

            migrationBuilder.DropTable(
                name: "Pilotes");
        }
    }
}
