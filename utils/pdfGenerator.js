import { categories } from "../constants/categories";

export function generatePDFContent(summary, categoryData) {
  const categoryRows = Object.entries(categoryData)
    .map(
      ([cat, value]) => `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">
            ${categories[cat]?.displayName || cat}
          </td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">
            R$ ${value.toFixed(2)}
          </td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">
            ${((value / summary.expenses) * 100).toFixed(1)}%
          </td>
        </tr>
      `,
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Resumo Financeiro - Dinero</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 30px; color: #333; }
          h1 { color: #1CB0F6; text-align: center; margin-bottom: 30px; }
          .summary-box { background: #f7f7f7; padding: 20px; border-radius: 12px; margin-bottom: 20px; }
          .summary-item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #ddd; }
          .summary-item:last-child { border-bottom: none; }
          .label { font-weight: bold; text-transform: uppercase; font-size: 14px; color: #666; }
          .value { font-size: 18px; font-weight: bold; }
          .income { color: #58CC02; }
          .expense { color: #FF4B4B; }
          .balance { color: #1CB0F6; font-size: 24px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background: #1CB0F6; color: white; padding: 12px; text-align: left; }
          .footer { margin-top: 40px; text-align: center; color: #999; font-size: 12px; }
        </style>
      </head>
      <body>
        <h1>💰 Resumo Financeiro - Dinero</h1>
        <div class="summary-box">
          <div class="summary-item">
            <span class="label">Total de Receitas</span>
            <span class="value income">R$ ${summary.income.toFixed(2)}</span>
          </div>
          <div class="summary-item">
            <span class="label">Total de Despesas</span>
            <span class="value expense">R$ ${summary.expenses.toFixed(2)}</span>
          </div>
          <div class="summary-item">
            <span class="label">Saldo</span>
            <span class="value balance">R$ ${summary.balance.toFixed(2)}</span>
          </div>
        </div>
        <h2 style="margin-top: 30px; color: #333;">📊 Despesas por Categoria</h2>
        <table>
          <thead>
            <tr>
              <th>Categoria</th>
              <th style="text-align: right;">Valor</th>
              <th style="text-align: right;">%</th>
            </tr>
          </thead>
          <tbody>${categoryRows}</tbody>
        </table>
        <div class="footer">
          <p>Gerado em ${new Date().toLocaleDateString("pt-BR")} às ${new Date().toLocaleTimeString("pt-BR")}</p>
          <p>Dinero - Seu gerenciador financeiro pessoal</p>
        </div>
      </body>
    </html>
  `;
}
