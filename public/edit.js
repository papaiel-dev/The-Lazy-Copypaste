async function initializeEditPage() {
    const form = document.getElementById('editForm');
    const titleInput = document.getElementById('title');
    const textInput = document.getElementById('text');
    const urlParams = new URLSearchParams(window.location.search);
    const textId = urlParams.get('id');

    if (textId) {
        const item = await db.feedbacks.get(parseInt(textId));
        if (item) {
            titleInput.value = item.title;
            textInput.value = item.text;
        }
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = {
            title: titleInput.value.trim(),
            text: textInput.value.trim(),
            created_at: new Date().toISOString()
        };

        if (textId) {
            await db.feedbacks.update(parseInt(textId), data);
        } else {
            await db.feedbacks.add(data);
        }
        window.location.href = '/manage.html';
    });
}
document.addEventListener('DOMContentLoaded', initializeEditPage);