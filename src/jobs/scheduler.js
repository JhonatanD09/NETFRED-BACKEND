import cron from "node-cron";
import { marcarCuentasVencidas } from "../db/queries/collectionAccount.query.js"; 
import dotenv from "dotenv";

dotenv.config();

// Correr todos los días a medianoche
cron.schedule("0 0 * * *", async () => {
  try {
    console.log("⏰ Ejecutando job: marcar cuentas vencidas");
    const diasVencimiento = process.env.COBRO_DIAS_VENCIMIENTO;
    await marcarCuentasVencidas(diasVencimiento);
    console.log("✅ Cuentas vencidas actualizadas");
  } catch (error) {
    console.error("❌ Error en job cuentas vencidas:", error);
  }
});
