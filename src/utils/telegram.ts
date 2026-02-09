
import { CONFIG } from "../config";

/**
 * Fetches the latest updates from the bot to find all unique Chat IDs
 * that have interacted with the bot recently.
 */
async function getRecentChatIds(): Promise<Set<string>> {
    const url = `https://api.telegram.org/bot${CONFIG.TELEGRAM_BOT_TOKEN}/getUpdates`;
    const chatIds = new Set<string>();

    // Always include the hardcoded ID if it exists
    if (CONFIG.TELEGRAM_ADMIN_CHAT_ID) {
        chatIds.add(CONFIG.TELEGRAM_ADMIN_CHAT_ID);
    }

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.ok && data.result.length > 0) {
            data.result.forEach((update: any) => {
                if (update.message && update.message.chat && update.message.chat.id) {
                    chatIds.add(String(update.message.chat.id));
                }
            });
        }
    } catch (e) {
        console.error("Error fetching updates:", e);
    }

    return chatIds;
}

export async function sendTelegramMessage(text: string) {
    // 1. Get all potential recipients (hardcoded + dynamic from updates)
    const recipients = await getRecentChatIds();

    if (recipients.size === 0) {
        alert("Ошибка: Бот не нашел ни одного получателя. Пожалуйста, отправьте боту @naura_meet_bot команду /start и попробуйте снова.");
        return false;
    }

    console.log(`Sending message to ${recipients.size} recipients:`, Array.from(recipients));

    let successCount = 0;
    const url = `https://api.telegram.org/bot${CONFIG.TELEGRAM_BOT_TOKEN}/sendMessage`;

    // 2. Send message to each recipient
    for (const chatId of recipients) {
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: text,
                    parse_mode: "HTML",
                }),
            });

            if (response.ok) {
                successCount++;
            } else {
                const error = await response.json();
                console.error(`Failed to send to ${chatId}:`, error);
            }
        } catch (error) {
            console.error(`Network error sending to ${chatId}:`, error);
        }
    }

    if (successCount > 0) {
        return true;
    } else {
        alert("Не удалось отправить сообщение ни одному получателю. Проверьте консоль.");
        return false;
    }
}

// Kept for compatibility if imported elsewhere, but now empty/unused logic
export async function checkUpdatesForChatId() {
    // No-op, logic moved to getRecentChatIds called inside sendTelegramMessage
}
