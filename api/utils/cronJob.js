const cron = require('node-cron');
const moment = require('moment');
const Task = require('../models/task');

const enviarRecordatorioTarea = async (tarea) => {
    console.log("estoy aqui");
    const horaActual = new Date();
    const horaFinTarea = new Date(tarea.endDate);

    // Si la tarea ya está completada, no enviar recordatorio
    if (tarea.isCompleted) return;

    // Calcula la diferencia en milisegundos
    const diferencia = horaFinTarea.getTime() - horaActual.getTime();

    // Si la diferencia es menor o igual a una hora
    if (diferencia <= 3600000) {
        // Envía el correo electrónico
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "grupitogpt4@gmail.com",
                pass: "khog vovx kkey blhf",
            },
        });

        const mailOptions = {
            from: '"Tasky G2" <grupitogpt4@gmail.com>', // Nombre personalizado y dirección de correo
            to: tarea.userEmail, // Asegúrate de que 'userEmail' sea un campo en tu modelo de tarea
            subject: "Recordatorio de Tarea Próxima a Vencer",
            text: `Hola! Solo un recordatorio de que tu tarea "${tarea.name}" está programada para terminar en una hora.`,
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log("Recordatorio de tarea enviado exitosamente");
        } catch (error) {
            console.error("Error enviando recordatorio de tarea:", error);
        }
    }
};

const tareaCron = cron.schedule('* * * * *', async () => {
    console.log('Verificando tareas para enviar recordatorios...');
    console.log(moment().format('YYYY-MM-DD HH:mm:ss'));

    const tareas = await Task.find({
        isCompleted: false,
        userEmail: { $exists: true, $ne: null },
        reminderSent: false,
    });

    tareas.forEach((tarea) => {
        enviarRecordatorioTarea(tarea).then(() => {
            tarea.reminderSent = true;
            tarea.save();
        }).catch((error) => {
            console.error("Error enviando recordatorio de tarea:", error);
        });
    });
});

module.exports = tareaCron;
