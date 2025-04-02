import { useState } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { CSVLink } from "react-csv";
import { UserProfile } from "../types";
import axios from "axios";

interface RankDataFull extends UserProfile {
  indications: number;
  rede: number;
}

interface Planilha extends RankDataFull {
  embaixador: string;
  leaders: number;
}

interface Props {
  usersAll: RankDataFull[];
}

const headers = [
  { label: "Nome", key: "name" },
  { label: "Data Nascimento", key: "nascimento" },
  { label: "Sexo", key: "sexo" },
  { label: "WhatsApp", key: "whatsapp" },
  { label: "E-mail", key: "email" },
  { label: "Bairro em que vota", key: "zona_eleitoral" },
  { label: "Cidade em que vota", key: "cidade" },
  { label: "Bairro", key: "bairro" },
  { label: "Embaixador", key: "user_id" },
  { label: "Indicações", key: "indications" },
  { label: "Rede", key: "rede" },
  { label: "Data de Cadastro", key: "created_at" }
];

export default function ExportButton({ usersAll }: Props) {
  const [loading, setLoading] = useState(false);

  const handleExportXLS = async () => {
    setLoading(true);
    try {
      const response = await axios.post("/api/users/export", { users: usersAll });
      const updatedUsers: Planilha[] = response.data.data.users;

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Usuários");

      // Cabeçalhos
      worksheet.columns = [
        { header: "Nome(obrigatório)", key: "name" },
        { header: "TotalIndicados", key: "indications" },
        { header: "TotalRede", key: "rede" },
        { header: "TotalLideres", key: "leaders" },
        { header: "DataNascimento", key: "nascimento" },
        { header: "Sexo", key: "sexo" },
        { header: "Whatsapp", key: "whatsapp" },
        { header: "Apelido", key: "apelido" },
        { header: "Email", key: "email" },
        { header: "Telefone", key: "telefone" },
        { header: "ZonaEleitoral", key: "zona_eleitoral" },
        { header: "NomeMae", key: "nome_mae" },
        { header: "CEP", key: "cep" },
        { header: "Logradouro", key: "logradouro" },
        { header: "Numero", key: "numero" },
        { header: "Complemento", key: "complemento" },
        { header: "Idade", key: "idade" },
        { header: "Bairro", key: "bairro" },
        { header: "Municipio", key: "cidade" },
        { header: "UF", key: "uf" },
        { header: "NomePessoaIndicacao", key: "embaixador" },
        { header: "Grupos", key: "grupos" },
        { header: "LocalVotacao", key: "local_votacao" },
        { header: "Lideranca", key: "user_id" },
        { header: "TagFacebook", key: "tag_facebook" },
        { header: "TagInstagram", key: "tag_instagram" },
        { header: "UrlOutraRedeSocial", key: "url_outra" },
        { header: "DataCadastro", key: "created_at" },
      ];

      updatedUsers.forEach((user) => {
        worksheet.addRow({
          name: user.name,
          indications: user.indications,
          rede: user.rede,
          leaders: user.leaders,
          nascimento: user.nascimento,
          sexo: user.sexo,
          whatsapp: user.whatsapp,
          apelido: "",
          email: user.email,
          telefone: user.whatsapp,
          zona_eleitoral: user.zona_eleitoral,
          nome_mae: "",
          cep: "",
          logradouro: "",
          numero: "",
          complemento: "",
          idade: user.idade,
          bairro: user.bairro,
          cidade: user.cidade,
          uf: "RJ",
          embaixador: user.embaixador || "",
          grupos: "",
          local_votacao: "",
          user_id: user.user_id,
          tag_facebook: "",
          tag_instagram: "",
          url_outra: "",
          created_at: user.created_at,
        });
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, "users.xlsx");
    } catch (error) {
      console.error("Error exporting users:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-end gap-4 mr-10">
      <button
        onClick={handleExportXLS}
        className="bg-blue-500 hover:bg-blue-700 text-10px text-white font-bold px-4 rounded"
        disabled={loading}
      >
        {loading ? "Exporting..." : "Export XLS"}
      </button>
      <CSVLink
        className="bg-blue-500 hover:bg-blue-700 text-10px text-white font-bold py-1 px-4 rounded"
        data={usersAll}
        headers={headers}
      >
        Export CSV
      </CSVLink>
    </div>
  );
}
