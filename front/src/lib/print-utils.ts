import { ApiResponseEntregas } from "./chart-utils";

export const imprimirEntregas = async (
    inicio: string,
    fin: string
) => {
    try {
        const res: ApiResponseEntregas = await fetch(
            `http://localhost:4000/api/producto-entregado?page=1&limit=100000&inicio=${inicio}&fin=${fin}`
        ).then(r => r.json());
        
        if (!res.value) {
            console.error("Error al obtener datos");
            return;
        }

        const rows = res.data.registros;

        const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Reporte de Entregas</title>
    <style>
      @page { 
        size: A4; 
        margin: 12mm; 
      }

      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family: Arial, sans-serif;
        padding: 20px;
        font-size: 12px;
      }

      h1 { 
        margin-bottom: 10px;
        font-size: 20px;
      }

      .meta {
        font-size: 11px;
        margin-bottom: 15px;
        color: #666;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        font-size: 11px;
      }

      th, td {
        border: 1px solid #ccc;
        padding: 8px 6px;
        text-align: left;
      }

      th {
        background: #f2f2f2;
        font-weight: bold;
      }

      tbody tr:nth-child(even) {
        background: #fafafa;
      }

      @media print {
        body {
          padding: 0;
        }
      }
    </style>
  </head>
  <body>
    <h1>Reporte de Entregas</h1>
    <div class="meta">
      <strong>Rango:</strong> ${inicio} a ${fin}<br/>
      <strong>Total registros:</strong> ${rows.length}
    </div>

    <table>
      <thead>
        <tr>
          <th>Departamento</th>
          <th>Producto</th>
          <th>Fecha</th>
          <th>Retiró</th>
          <th>Entregó</th>
          <th>Cant.</th>
        </tr>
      </thead>
      <tbody>
        ${rows.map(r => `
          <tr>
            <td>${r.departamento}</td>
            <td>${r.producto}</td>
            <td>${r.fecha}</td>
            <td>${r.quien_retiro}</td>
            <td>${r.quien_entrega}</td>
            <td>${r.cantidad}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>

    <script>
      window.onload = function() {
        window.print();
        window.onafterprint = () => window.close();
      };
    </script>
  </body>
</html>
`;

        const win = window.open("", "_blank");
        
        if (!win) {
            alert("Por favor, permite las ventanas emergentes para imprimir");
            return;
        }

        win.document.open();
        win.document.write(html);
        win.document.close();

    } catch (error) {
        console.error("Error al imprimir:", error);
        alert("Error al generar el reporte");
    }
};